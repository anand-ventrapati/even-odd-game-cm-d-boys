
-- Enable Row Level Security if not already enabled
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT into the games table (use WITH CHECK, not USING)
CREATE POLICY "Allow anyone to insert games"
  ON public.games
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to SELECT from the games table
CREATE POLICY "Allow anyone to select games"
  ON public.games
  FOR SELECT
  USING (true);

-- Allow anyone to UPDATE the games table
CREATE POLICY "Allow anyone to update games"
  ON public.games
  FOR UPDATE
  USING (true);
