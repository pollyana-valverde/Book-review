import "server-only";
import { Hono } from "hono";
import { revalidateTag } from "next/cache";
import { zValidator } from "@hono/zod-validator";
import * as reviewService from "@/server/modules/reviews/review.service";
import {
  createReviewSchema,
  updateReviewSchema,
  listReviewsQuerySchema,
} from "@/server/modules/reviews/review.contract";
import { reviewsTag, reviewTag, REVALIDATE_NOW } from "@/server/lib/cache-tags";
import { zodValidationHook } from "@/server/api/lib/validation-hook";
import type { AppEnv } from "@/server/api/factory";

const reviewRoutes = new Hono<AppEnv>()
  .get(
    "/",
    zValidator("query", listReviewsQuerySchema, zodValidationHook),
    async (c) => {
      const query = c.req.valid("query");
      const result = await reviewService.list(query);
      return c.json(result);
    }
  )
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const review = await reviewService.getById(id);
    return c.json(review);
  })
  .post(
    "/",
    zValidator("json", createReviewSchema, zodValidationHook),
    async (c) => {
      const data = c.req.valid("json");
      const review = await reviewService.create(data);

      revalidateTag(reviewsTag(), REVALIDATE_NOW);

      return c.json(review, 201);
    }
  )
  .patch(
    "/:id",
    zValidator("json", updateReviewSchema, zodValidationHook),
    async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const review = await reviewService.update(id, data);

      revalidateTag(reviewsTag(), REVALIDATE_NOW);
      revalidateTag(reviewTag(id), REVALIDATE_NOW);

      return c.json(review);
    }
  )
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await reviewService.remove(id);

    revalidateTag(reviewsTag(), REVALIDATE_NOW);
    revalidateTag(reviewTag(id), REVALIDATE_NOW);

    return c.body(null, 204);
  });

export { reviewRoutes };
