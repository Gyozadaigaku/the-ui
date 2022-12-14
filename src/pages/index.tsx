import type React from "react";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/routers/_app";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
  const [ids, setIds] = useState([0, 0]);

  const [first, second] = ids;

  useEffect(() => {
    setIds(getOptionsForVote());
  }, []);

  const firstPokemon = trpc["get-pokemon-by-id"].useQuery({ id: first });
  const secondPokemon = trpc["get-pokemon-by-id"].useQuery({ id: second });

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    setIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokémon is Rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex items-center justify-between max-w-2xl ">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">VS</div>

              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )}
      </div>
    </div>
  );
}

type RouterOutput = inferRouterOutputs<AppRouter>;

type PokemonFromServer = RouterOutput["get-pokemon-by-id"];

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xl text-center capitalize mt-[-0.5rem]">
        {props.pokemon.name}
      </div>
      <img
        src={props.pokemon.sprites.front_default}
        className="w-full"
        alt=""
      />
      <button className={btn} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};
