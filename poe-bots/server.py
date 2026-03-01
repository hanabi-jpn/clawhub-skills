"""
Poe Bot Server for all 40 hanabi-jpn skills.

Serves each skill as a separate Poe bot, routing messages to the correct
bot based on bot name. Each bot prepends its extracted system prompt and
forwards to the configured underlying model.

Usage:
  Local:  python server.py
  Modal:  modal deploy server.py

Environment Variables:
  POE_ACCESS_KEY  — Your Poe API access key (required)
"""

from __future__ import annotations

import os
import logging
from typing import AsyncIterable

import fastapi_poe as fp
from fastapi_poe.types import ProtocolMessage

from bot_configs import get_all_bots

# ─────────────────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("poe-bots")

# ─────────────────────────────────────────────────────────
# Bot class
# ─────────────────────────────────────────────────────────


class HanabiBotBase(fp.PoeBot):
    """Base bot class that prepends a system prompt and forwards to an LLM."""

    def __init__(
        self,
        bot_name: str,
        display_name: str,
        system_prompt: str,
        model: str = "GPT-4o",
        description: str = "",
        suggested_replies: list[str] | None = None,
        **kwargs,
    ):
        super().__init__()
        self.bot_name = bot_name
        self.display_name = display_name
        self.system_prompt = system_prompt
        self.model = model
        self.description = description
        self._suggested_replies = suggested_replies or []

    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncIterable[fp.PartialResponse]:
        """Prepend system prompt and forward to underlying model."""
        logger.info(
            f"[{self.display_name}] Received query from user "
            f"(messages={len(request.query)}, model={self.model})"
        )

        # Build messages: system prompt + user conversation
        messages = [
            ProtocolMessage(role="system", content=self.system_prompt)
        ] + request.query

        # Create a new request with the modified messages
        request.query = messages

        try:
            async for msg in fp.stream_request(
                request, self.model, request.access_key
            ):
                yield msg
        except Exception as e:
            logger.error(f"[{self.display_name}] Error streaming: {e}")
            yield fp.PartialResponse(
                text=f"An error occurred while processing your request. "
                f"Please try again later.\n\nError: {type(e).__name__}: {e}"
            )

    async def get_settings(self, setting: fp.SettingsRequest) -> fp.SettingsResponse:
        """Return bot settings including server bot dependencies."""
        return fp.SettingsResponse(
            server_bot_dependencies={self.model: 1},
            introduction_message=(
                f"Welcome to **{self.display_name}** by hanabi-jpn!\n\n"
                f"{self.description}\n\n"
                f"How can I help you today?"
            ),
        )

    async def on_feedback(self, feedback: fp.ReportFeedbackRequest) -> None:
        """Log user feedback for analytics."""
        logger.info(
            f"[{self.display_name}] Feedback: "
            f"conversation={feedback.conversation_id}, "
            f"type={feedback.feedback_type}"
        )


# ─────────────────────────────────────────────────────────
# Bot registry
# ─────────────────────────────────────────────────────────


def create_bot_instances() -> dict[str, HanabiBotBase]:
    """Create all 40 bot instances from configs."""
    all_bots = get_all_bots()
    instances = {}

    for slug, config in all_bots.items():
        bot_name = config["bot_name"]
        if not config.get("system_prompt"):
            logger.warning(f"Skipping {slug}: no system prompt found")
            continue

        bot = HanabiBotBase(
            bot_name=bot_name,
            display_name=config["display_name"],
            system_prompt=config["system_prompt"],
            model=config["model"],
            description=config["description"],
            suggested_replies=config.get("suggested_replies", []),
        )
        instances[bot_name] = bot
        logger.info(
            f"Registered bot: {bot_name} "
            f"({config['tier']}, model={config['model']}, "
            f"prompt={len(config['system_prompt'])} chars)"
        )

    return instances


# ─────────────────────────────────────────────────────────
# Application setup
# ─────────────────────────────────────────────────────────

# Create all bot instances
BOT_INSTANCES = create_bot_instances()

# Build the bot name -> instance mapping for Poe
bot_map = {name: bot for name, bot in BOT_INSTANCES.items()}

logger.info(f"Total bots registered: {len(bot_map)}")
logger.info(f"Bot names: {', '.join(bot_map.keys())}")

# ─────────────────────────────────────────────────────────
# FastAPI app (for local running / Modal deployment)
# ─────────────────────────────────────────────────────────

# Create the Poe bot app with all bots
app = fp.make_app(
    list(bot_map.values()),
    access_key=os.environ.get("POE_ACCESS_KEY", ""),
    bot_name=list(bot_map.keys()),
)


# ─────────────────────────────────────────────────────────
# Modal deployment (optional)
# ─────────────────────────────────────────────────────────

try:
    import modal

    # Define Modal image with dependencies
    image = modal.Image.debian_slim().pip_install(
        "fastapi-poe>=0.0.47",
        "uvicorn>=0.27.0",
    )

    modal_app = modal.App("hanabi-poe-bots")

    @modal_app.function(
        image=image,
        secrets=[modal.Secret.from_name("poe-access-key")],
    )
    @modal.asgi_app()
    def fastapi_app():
        return app

except ImportError:
    # Modal not installed; running locally
    pass


# ─────────────────────────────────────────────────────────
# Local runner
# ─────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    access_key = os.environ.get("POE_ACCESS_KEY")
    if not access_key:
        print(
            "WARNING: POE_ACCESS_KEY not set. "
            "Set it via: export POE_ACCESS_KEY=your_key_here"
        )

    port = int(os.environ.get("PORT", 8080))
    print(f"\nStarting Poe bot server on port {port}")
    print(f"Serving {len(bot_map)} bots:")
    for name in sorted(bot_map.keys()):
        bot = bot_map[name]
        print(f"  - {name} ({bot.display_name})")
    print()

    uvicorn.run(app, host="0.0.0.0", port=port)
