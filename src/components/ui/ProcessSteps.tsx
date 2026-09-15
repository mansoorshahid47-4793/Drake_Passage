export function ProcessSteps({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span aria-hidden="true" className="font-display text-3xl text-teal leading-none">{i + 1}</span>
          <div>
            <h3 className="text-[1.25rem]">{step.title}</h3>
            <p className="text-muted">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
