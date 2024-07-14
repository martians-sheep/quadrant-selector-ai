export async function Button() {
  async function handleClick() {
    "use server";
    console.log("Button clicked");
  }

  return (
    <form action={handleClick}>
      <button type="submit">Click me</button>
    </form>
  );
}
