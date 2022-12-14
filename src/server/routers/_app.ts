import { z } from "zod";
import { procedure, router } from "@/server/trpc";

import { PokemonClient } from "pokenode-ts";

export const appRouter = router({
  "get-pokemon-by-id": procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const api = new PokemonClient();

      const pokemon = await api.getPokemonById(input.id);
      return pokemon;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
