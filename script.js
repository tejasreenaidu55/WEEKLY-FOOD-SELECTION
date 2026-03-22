document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const resultEl = document.getElementById("result");
  resultEl.innerText = "Predicting...";
  resultEl.style.color = "blue";

  try {
    const data = {
      age: parseInt(document.getElementById("age").value),
      gender: document.getElementById("gender").value,
      budget: parseFloat(document.getElementById("budget").value)
    };

    if (isNaN(data.age) || isNaN(data.budget)) {
      throw new Error("Please enter valid numbers for age and budget");
    }

    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    const result = await res.json();
    resultEl.innerText = `Recommended: ${result.recommendation}`;
    resultEl.style.color = "green";
  } catch (error) {
    console.error("Prediction error:", error);
    resultEl.innerText = `Error: ${error.message}`;
    resultEl.style.color = "red";
  }
});
