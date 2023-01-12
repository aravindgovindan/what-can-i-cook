import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Dropdown from "../components/dropdown";
import { cuisineList, mealTypes } from "../constants/data";
import styles from "./index.module.css";

export default function Home() {
  const [ingreds, setIngreds] = useState("");
  const [cuisine, setCuisine] = useState("american");
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
          cuisine: cuisineList[cuisine],
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

      <nav className={styles.navbar}>
        <Link className={styles.selected} href="/">Home</Link>
        <Link href="/fusion">Fusion</Link>
      </nav>

      <main className={styles.main}>
        <img src="/food.png" className={styles.icon} />
        <h3>What can I cook?</h3>
        <form onSubmit={onSubmit}>

          <Dropdown
            label="Select a meal type: "
            options={mealTypes}
            selection={meal}
            handleChange={setMeal}
          ></Dropdown>

          <Dropdown
            label="Select a cuisine: "
            options={cuisineList}
            selection={cuisine}
            handleChange={setCuisine}
          ></Dropdown>

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
