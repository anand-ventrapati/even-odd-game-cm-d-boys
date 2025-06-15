
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function GameHowToPlayModal({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-md w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Info className="h-6 w-6 text-blue-500" />
            How to Play
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 text-base space-y-4 text-gray-100">
          <ol className="list-decimal list-inside space-y-2">
            <li>Both players join a game using the Game PIN and select their player view.</li>
            <li>Each player starts with <span className="font-bold">10 points</span>.</li>
            <li>The first player (current turn) secretly chooses a number between 0-9 and places a bet (amount of points).</li>
            <li>The bet amount cannot be higher than either player's current points.</li>
            <li>The other player tries to guess if the chosen number is <span className="font-semibold text-green-300">even</span> or <span className="font-semibold text-red-400">odd</span>.</li>
            <li>If the guess is <span className="text-green-300 font-semibold">correct</span>, the guesser wins the bet amount from the bettor.</li>
            <li>If the guess is <span className="text-red-400 font-semibold">wrong</span>, the bettor wins the bet amount from the guesser.</li>
            <li>Points are updated after every guess. The next round begins with the other player as the bettor.</li>
            <li>The game ends if a player reaches <span className="font-bold">20 points</span> or drops to <span className="font-bold">0 points</span>.</li>
          </ol>
          <div className="pt-4 text-center text-base text-pink-300 font-semibold">
            A timepass masterpiece by Anand & Sohail
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
