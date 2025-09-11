
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function GameHowToPlayModal({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-md w-full bg-white shadow-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-gray-800">
            <Info className="h-6 w-6 text-blue-600" />
            How to Play
          </SheetTitle>
        </SheetHeader>
        {/* Scrollable content area with clean white background */}
        <div className="py-4 text-base space-y-4 text-gray-800 overflow-y-auto bg-white rounded-lg" style={{ maxHeight: "60vh" }}>
          <ol className="list-decimal list-inside space-y-3 p-4">
            <li>Both players join a game using the Game PIN and select their player view.</li>
            <li>Each player starts with <span className="font-bold text-blue-600">10 points.</span></li>
            <li>The first player (current turn) secretly chooses a number between 0-9 and places a bet (amount of points).</li>
            <li>The bet amount cannot be higher than either player's current points.</li>
            <li>
              The other player tries to guess if the chosen number is{" "}
              <span className="font-semibold text-green-600">even</span> or{" "}
              <span className="font-semibold text-red-600">odd</span>.
            </li>
            <li>
              If the guess is{" "}
              <span className="text-green-600 font-semibold">correct</span>, the guesser wins the bet amount from the bettor.
            </li>
            <li>
              If the guess is{" "}
              <span className="text-red-600 font-semibold">wrong</span>, the bettor wins the bet amount from the guesser.
            </li>
            <li>
              Points are updated after every guess. The next round begins with the other player as the bettor.
            </li>
            <li>
              The game ends if a player reaches <span className="font-bold text-blue-600">20 points</span> or drops to <span className="font-bold text-red-600">0 points</span>.
            </li>
          </ol>
        </div>
        <div className="flex justify-end pt-2">
          <SheetClose asChild>
            <Button variant="secondary" className="text-gray-800 bg-gray-100 hover:bg-gray-200">Close</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
