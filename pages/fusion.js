import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Dropdown from "../components/dropdown";
import { cuisineList, mealTypes } from "../constants/data";
import styles from "./index.module.css";

export default function Fusion() {
  const [cuisine1, setCuisine1] = useState("american");
  const [cuisine2, setCuisine2] = useState("chinese");
  const [meal, setMeal] = useState("dinner");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (cuisine1 === cuisine2) throw new Error("Please select two different cuisines.")
      const response = await fetch("/api/combine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal: meal,
          cuisine1: cuisineList[cuisine1],
          cuisine2: cuisineList[cuisine2],
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
        <title>Fusion</title>
        <link rel="icon" href="/food.png" />
      </Head>

      <nav className={styles.navbar}>
        <Link href="/">Home</Link>
        <Link className={styles.selected} href="/fusion">Fusion</Link>
      </nav>

      <main className={styles.main}>
        <img src="/food.png" className={styles.icon} />
        <h3>Select cuisines to combine</h3>
        <form onSubmit={onSubmit}>

          <Dropdown
            label="Cuisine 1: "
            options={cuisineList}
            selection={cuisine1}
            handleChange={setCuisine1}
          ></Dropdown>
          <Dropdown
            label="Cuisine 2: "
            options={cuisineList}
            selection={cuisine2}
            handleChange={setCuisine2}
          ></Dropdown>
          <Dropdown
            label="Select a meal type: "
            options={mealTypes}
            selection={meal}
            handleChange={setMeal}
          ></Dropdown>

          <input type="submit" value="Combine" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
