export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      <div className="space-y-1">
        <p className="font-semibold text-lg text-foreground">
          Generating your adventure...
        </p>
        <p className="text-muted-foreground">
          Our AI is crafting the perfect plan. This may take a moment.
        </p>
      </div>
    </div>
  );
}
