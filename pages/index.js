import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [ingreds, setIngreds] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [meal, setMeal] = useState("dinner");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal: meal,
          cuisine: cuisine,
          ingreds: ingreds
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>What can I cook</title>
        <link rel="icon" href="/food.png" />
      </Head>

      <main className={styles.main}>
        <img src="/food.png" className={styles.icon} />
        <h3>What can I cook?</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="meal">Select a meal type</label>
          <select name="meal" id="meals" value={meal} onChange={(e) => setMeal(e.target.value)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snacks">Snack</option>
            <option value="dinner">Dinner</option>
          </select>
          <input type="text"
            name="cuisine"
            placeholder="Enter a cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
          <input
            type="text"
            name="ingredients"
            placeholder="What ingredients do you have?"
            value={ingreds}
            onChange={(e) => setIngreds(e.target.value)}
          />
          <input type="submit" value="Generate dish" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
