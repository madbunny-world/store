// Declares the @modal parallel slot so intercepted product routes render over
// the still-mounted grid (spec §6.1). `modal` is null (default.tsx) unless a card
// was clicked via client navigation.
export default function CollectiblesLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
