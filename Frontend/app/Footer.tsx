export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 z-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://github.com/ShivaanjayNarula"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Shivaanjay Narula
          </a>
          .
        </p>
      </div>
    </footer>
  )
}