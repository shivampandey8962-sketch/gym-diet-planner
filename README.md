# 🏋️ FitFuel - Indian Diet Planner

A modern, gym-themed web application that generates personalized Indian diet plans based on your body metrics and fitness goals.

![FitFuel Banner](https://img.shields.io/badge/FitFuel-Diet%20Planner-ff4d4d?style=for-the-badge)

## ✨ Features

- 📊 **BMI Calculator** - Visual body mass index indicator
- 🔥 **Calorie Calculator** - Daily calorie target using Mifflin-St Jeor equation
- 🥗 **Personalized Meal Plans** - Breakfast, Lunch, Dinner & Snacks
- 🇮🇳 **Indian Cuisine** - Authentic Indian diet options
- 🥬 **Diet Preferences** - Veg, Non-Veg, or Both
- 🎯 **Goal-Based Plans** - Weight Loss, Maintain, or Weight Gain
- 🖨️ **Print Support** - Save your diet plan as PDF
- 📱 **Responsive Design** - Works on desktop and mobile

---

## 🚀 How to Run the App

### Option 1: Using Python (Recommended)

1. **Open Terminal/Command Prompt** in the project folder

2. **Start the server:**
   ```bash
   python -m http.server 8080
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8080
   ```

### Option 2: Using Node.js

1. **Install http-server globally:**
   ```bash
   npm install -g http-server
   ```

2. **Start the server:**
   ```bash
   http-server -p 8080
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8080
   ```

### Option 3: Using VS Code Live Server

1. **Install the "Live Server" extension** in VS Code

2. **Right-click on `index.html`** and select "Open with Live Server"

3. The app will automatically open in your default browser

### Option 4: Direct File Open (Limited)

> ⚠️ Note: Some features may not work due to CORS restrictions

Simply double-click on `index.html` to open it in your browser.

---

## 📁 Project Structure

```
gym-diet-planner/
├── index.html          # Main HTML page
├── styles.css          # Gym-themed dark UI styles
├── app.js              # JavaScript logic
├── data/
│   └── diet-plans.json # Indian diet data
└── README.md           # This file
```

---

## 🎮 How to Use

1. **Enter Your Details:**
   - Age (10-100 years)
   - Height in centimeters
   - Weight in kilograms

2. **Select Your Gender:**
   - Male or Female

3. **Choose Food Preference:**
   - 🥬 Veg - Vegetarian options only
   - 🍗 Non-Veg - Non-vegetarian options
   - 🍽️ Both - Mix of veg and non-veg

4. **Select Your Goal:**
   - 📉 Weight Loss - Calorie deficit diet
   - ⚖️ Maintain Weight - Balanced diet
   - 📈 Weight Gain - Calorie surplus diet

5. **Click "Generate Diet Plan"** to get your personalized plan!

---

## 🍽️ Diet Plans Included

### Vegetarian Options
- Oats Upma, Moong Dal Chilla, Poha
- Palak Paneer, Dal Makhani, Veg Biryani
- Paneer Tikka, Khichdi, Daliya
- Roasted Chana, Sprouts Chaat, Lassi

### Non-Vegetarian Options
- Egg Omelette, Chicken Sandwich, Keema Paratha
- Chicken Biryani, Butter Chicken, Fish Curry
- Tandoori Chicken, Grilled Fish, Prawn Curry
- Chicken Tikka, Seekh Kebab, Fish Fry

---

## 🧮 Calculations Used

### BMI (Body Mass Index)
```
BMI = Weight (kg) / Height (m)²
```

### BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation
```
Male:   BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
Female: BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
```

### Daily Calorie Needs
```
TDEE = BMR × 1.55 (moderate activity)

Weight Loss:    TDEE - 500 calories
Maintain:       TDEE
Weight Gain:    TDEE + 500 calories
```

---

## 🔮 Future Enhancements

- [ ] MongoDB integration for storing user data
- [ ] REST API backend with Node.js/Express
- [ ] User authentication and profile saving
- [ ] Weekly meal planning
- [ ] Grocery shopping list generator
- [ ] Recipe details with cooking instructions
- [ ] Progress tracking and analytics

---

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with CSS Variables & Flexbox/Grid
- **JavaScript (ES6+)** - Logic and DOM manipulation
- **JSON** - Diet data storage

---

## 📄 License

This project is open source and available for personal use.

---

<p align="center">
  Made with ❤️ for fitness enthusiasts
</p>
