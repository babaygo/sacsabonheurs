import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Sacs à Bonheur</title>
        <meta name="description" content="Boutique artisanale de sacs faits main en France" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenue chez Sacs à Bonheur</h1>
        <p className="text-lg text-gray-700">Découvrez mes sacs faits main avec passion, en France !</p>
        <Link href="/boutique" >
          <Button className="mt-6 py-5 text-base group flex items-center">
            <p>Explorer la boutique</p>
            <MoveRight className="scale-125 transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-150" />
          </Button>
        </Link>
      </main>
    </>
  );
}
