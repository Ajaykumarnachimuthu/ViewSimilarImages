"""
CLI script to trigger catalog ingestion and synchronization.
Usage:
    python -m backend.app.scripts.ingest --limit 50
"""

import argparse
import asyncio
import logging
import sys
from backend.app.services.ingestion_service import IngestionService

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ingestion_cli")


async def main():
    parser = argparse.ArgumentParser(description="Ingest external products into Supabase")
    parser.add_argument("--limit", type=int, default=40, help="Maximum products to import")
    args = parser.parse_args()

    logger.info("Initializing Vision2Web Catalog Ingestion...")
    service = IngestionService()
    report = await service.run_ingestion(limit=args.limit)

    print("\n" + "=" * 50)
    print("VISION2WEB INGESTION REPORT")
    print("=" * 50)
    print(f"External products discovered:    {report.discovered}")
    print(f"Valid products processed:        {report.valid}")
    print(f"Rejected products:               {report.rejected}")
    print(f"Categories upserted:             {report.categories_upserted}")
    print(f"Brands upserted:                 {report.brands_upserted}")
    print(f"Products upserted:               {report.products_inserted}")
    print(f"Visual metadata generated:       {report.visual_metadata_generated}")
    if report.errors:
        print(f"Errors encountered:              {len(report.errors)}")
        for err in report.errors[:5]:
            print(f"  - {err}")
    print("=" * 50 + "\n")

    if report.rejected > 0 or report.errors:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
