export function FormError({ message }: { message: string | undefined }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-red-500 text-sm mt-1" role="alert" aria-live="assertive">
      {message}
    </p>
  );
}
