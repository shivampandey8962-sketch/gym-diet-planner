// Global variable to store diet data
let dietData = null;

// DOM Elements
const form = document.getElementById('dietForm');
const resultsSection = document.getElementById('results');
const printBtn = document.getElementById('printBtn');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadDietData();
    setupEventListeners();
});

// Load diet data from JSON file
async function loadDietData() {
    try {
        const response = await fetch('data/diet-plans.json');
        if (!response.ok) {
            throw new Error('Failed to load diet data');
        }
        dietData = await response.json();
        console.log('Diet data loaded successfully');
    } catch (error) {
        console.error('Error loading diet data:', error);
        showError('Failed to load diet plans. Please refresh the page.');
    }
}

// Setup event listeners
function setupEventListeners() {
    form.addEventListener('submit', handleFormSubmit);
    printBtn.addEventListener('click', () => window.print());
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = getFormData();
    
    // Show loading state
    showLoading();
    
    // Simulate API call delay for better UX
    setTimeout(() => {
        generateDietPlan(formData);
    }, 1000);
}

// Validate form inputs
function validateForm() {
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const goal = document.querySelector('input[name="goal"]:checked');
    const foodPref = document.querySelector('input[name="foodPref"]:checked');
    
    if (!age || age < 10 || age > 100) {
        showAlert('Please enter a valid age (10-100 years)');
        return false;
    }
    
    if (!height || height < 100 || height > 250) {
        showAlert('Please enter a valid height (100-250 cm)');
        return false;
    }
    
    if (!weight || weight < 30 || weight > 300) {
        showAlert('Please enter a valid weight (30-300 kg)');
        return false;
    }
    
    if (!gender) {
        showAlert('Please select your gender');
        return false;
    }
    
    if (!goal) {
        showAlert('Please select your goal');
        return false;
    }
    
    if (!foodPref) {
        showAlert('Please select your food preference');
        return false;
    }
    
    return true;
}

// Get form data
function getFormData() {
    return {
        age: parseInt(document.getElementById('age').value),
        height: parseInt(document.getElementById('height').value),
        weight: parseInt(document.getElementById('weight').value),
        gender: document.querySelector('input[name="gender"]:checked').value,
        goal: document.querySelector('input[name="goal"]:checked').value,
        foodPref: document.querySelector('input[name="foodPref"]:checked').value
    };
}

// Calculate BMI
function calculateBMI(height, weight) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
}

// Get BMI category
function getBMICategory(bmi) {
    if (bmi < 18.5) return { text: 'Underweight', class: 'underweight' };
    if (bmi < 25) return { text: 'Normal Weight', class: 'normal' };
    if (bmi < 30) return { text: 'Overweight', class: 'overweight' };
    return { text: 'Obese', class: 'obese' };
}

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
}

// Calculate daily calorie needs
function calculateCalories(bmr, goal) {
    // Assuming moderate activity level (1.55 multiplier)
    const tdee = bmr * 1.55;
    
    switch (goal) {
        case 'loss':
            return Math.round(tdee - 500); // 500 calorie deficit
        case 'gain':
            return Math.round(tdee + 500); // 500 calorie surplus
        default:
            return Math.round(tdee);
    }
}

// Calculate macronutrients
function calculateMacros(calories, goal) {
    let proteinPercent, carbPercent, fatPercent;
    
    switch (goal) {
        case 'loss':
            proteinPercent = 0.35;
            carbPercent = 0.35;
            fatPercent = 0.30;
            break;
        case 'gain':
            proteinPercent = 0.30;
            carbPercent = 0.45;
            fatPercent = 0.25;
            break;
        default:
            proteinPercent = 0.30;
            carbPercent = 0.40;
            fatPercent = 0.30;
    }
    
    return {
        protein: Math.round((calories * proteinPercent) / 4), // 4 calories per gram
        carbs: Math.round((calories * carbPercent) / 4),
        fat: Math.round((calories * fatPercent) / 9) // 9 calories per gram
    };
}

// Get goal key for diet data
function getGoalKey(goal) {
    switch (goal) {
        case 'loss': return 'weightLoss';
        case 'gain': return 'weightGain';
        default: return 'maintain';
    }
}

// Get food preference key
function getFoodPrefKey(foodPref) {
    return foodPref === 'veg' ? 'veg' : 'nonveg';
}

// Get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Generate diet plan
function generateDietPlan(formData) {
    if (!dietData) {
        showError('Diet data not loaded. Please refresh the page.');
        return;
    }
    
    const { age, height, weight, gender, goal, foodPref } = formData;
    
    // Calculate metrics
    const bmi = calculateBMI(height, weight);
    const bmiCategory = getBMICategory(bmi);
    const bmr = calculateBMR(weight, height, age, gender);
    const calories = calculateCalories(bmr, goal);
    const macros = calculateMacros(calories, goal);
    
    // Get appropriate diet plan
    const goalKey = getGoalKey(goal);
    const foodPrefKey = getFoodPrefKey(foodPref);
    
    // Get diet plans based on preferences
    let plans;
    if (foodPref === 'both') {
        // Mix veg and non-veg options
        const vegPlans = dietData[goalKey].veg;
        const nonVegPlans = dietData[goalKey].nonveg;
        plans = {
            breakfast: [...vegPlans.breakfast, ...nonVegPlans.breakfast],
            lunch: [...vegPlans.lunch, ...nonVegPlans.lunch],
            dinner: [...vegPlans.dinner, ...nonVegPlans.dinner],
            snacks: [...vegPlans.snacks, ...nonVegPlans.snacks]
        };
    } else {
        plans = dietData[goalKey][foodPrefKey];
    }
    
    // Select random meals
    const selectedMeals = {
        breakfast: getRandomItem(plans.breakfast),
        lunch: getRandomItem(plans.lunch),
        dinner: getRandomItem(plans.dinner),
        snacks: [getRandomItem(plans.snacks), getRandomItem(plans.snacks)]
    };
    
    // Get tips
    const tips = dietData.tips[goalKey];
    
    // Render the results
    renderResults({
        formData,
        bmi,
        bmiCategory,
        calories,
        macros,
        selectedMeals,
        tips
    });
    
    // Show print button
    printBtn.classList.add('visible');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Render results
function renderResults(data) {
    const { formData, bmi, bmiCategory, calories, macros, selectedMeals, tips } = data;
    
    // Calculate BMI marker position (0-100%)
    const bmiPosition = Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100);
    
    // Calculate total calories from meals
    const totalMealCalories = selectedMeals.breakfast.calories + 
                              selectedMeals.lunch.calories + 
                              selectedMeals.dinner.calories +
                              selectedMeals.snacks.reduce((sum, snack) => sum + snack.calories, 0);
    
    const goalText = {
        loss: 'Weight Loss',
        maintain: 'Maintain Weight',
        gain: 'Weight Gain'
    };
    
    const html = `
        <!-- User Stats -->
        <div class="user-stats">
            <div class="stat-item">
                <div class="stat-value">${formData.age}</div>
                <div class="stat-label">Years Old</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${formData.height}</div>
                <div class="stat-label">Height (cm)</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${formData.weight}</div>
                <div class="stat-label">Weight (kg)</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${formData.gender === 'male' ? '♂' : '♀'}</div>
                <div class="stat-label">${formData.gender === 'male' ? 'Male' : 'Female'}</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">🎯</div>
                <div class="stat-label">${goalText[formData.goal]}</div>
            </div>
        </div>
        
        <!-- BMI Indicator -->
        <div class="bmi-indicator">
            <div class="bmi-header">
                <h3>📊 Your Body Mass Index (BMI)</h3>
                <div class="bmi-value">${bmi}</div>
            </div>
            <div class="bmi-bar">
                <div class="bmi-marker" style="left: ${bmiPosition}%">📍</div>
            </div>
            <div class="bmi-labels">
                <span>Underweight<br>&lt;18.5</span>
                <span>Normal<br>18.5-24.9</span>
                <span>Overweight<br>25-29.9</span>
                <span>Obese<br>&gt;30</span>
            </div>
            <div class="bmi-category ${bmiCategory.class}">${bmiCategory.text}</div>
        </div>
        
        <!-- Calorie Target -->
        <div class="calorie-target">
            <h3>Daily Calorie Target</h3>
            <div class="calorie-number">${calories.toLocaleString()}</div>
            <div class="calorie-unit">calories/day</div>
            <div class="macro-breakdown">
                <div class="macro-item">
                    <div class="macro-value">${macros.protein}g</div>
                    <div class="macro-label">Protein</div>
                </div>
                <div class="macro-item">
                    <div class="macro-value">${macros.carbs}g</div>
                    <div class="macro-label">Carbs</div>
                </div>
                <div class="macro-item">
                    <div class="macro-value">${macros.fat}g</div>
                    <div class="macro-label">Fat</div>
                </div>
            </div>
        </div>
        
        <!-- Meal Plans -->
        <div class="meal-plans">
            ${renderMealCard('☀️', 'Breakfast', '7:00 - 9:00 AM', selectedMeals.breakfast)}
            ${renderMealCard('🌞', 'Lunch', '12:30 - 2:00 PM', selectedMeals.lunch)}
            ${renderMealCard('🌙', 'Dinner', '7:00 - 8:30 PM', selectedMeals.dinner)}
            ${renderSnacksCard(selectedMeals.snacks)}
        </div>
        
        <!-- Tips Section -->
        <div class="tips-section">
            <h3>💡 Tips for ${goalText[formData.goal]}</h3>
            <div class="tips-list">
                ${tips.map((tip, index) => `
                    <div class="tip-item">
                        <div class="tip-icon">${index + 1}</div>
                        <p>${tip}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    resultsSection.innerHTML = html;
}

// Render meal card
function renderMealCard(icon, title, time, meal) {
    const ingredientsHtml = meal.ingredients ? `
        <div class="ingredients">
            <h5>Key Ingredients</h5>
            <div class="ingredient-tags">
                ${meal.ingredients.map(ing => `<span class="ingredient-tag">${ing}</span>`).join('')}
            </div>
        </div>
    ` : '';
    
    return `
        <div class="meal-card">
            <div class="meal-header">
                <div class="meal-icon">${icon}</div>
                <div class="meal-title">
                    <h3>${title}</h3>
                    <span>${time}</span>
                </div>
                <div class="meal-calories">
                    <div class="value">${meal.calories}</div>
                    <div class="label">kcal</div>
                </div>
            </div>
            <div class="meal-content">
                <div class="meal-item">
                    <div class="meal-item-header">
                        <h4>${meal.name}</h4>
                        <span class="meal-item-calories">${meal.calories} kcal</span>
                    </div>
                    <p>${meal.description}</p>
                    <div class="meal-macros">
                        <span class="macro">
                            <span class="macro-dot protein"></span>
                            Protein: ${meal.protein}
                        </span>
                        <span class="macro">
                            <span class="macro-dot carbs"></span>
                            Carbs: ${meal.carbs}
                        </span>
                        <span class="macro">
                            <span class="macro-dot fat"></span>
                            Fat: ${meal.fat}
                        </span>
                    </div>
                    ${ingredientsHtml}
                </div>
            </div>
        </div>
    `;
}

// Render snacks card
function renderSnacksCard(snacks) {
    const totalCalories = snacks.reduce((sum, snack) => sum + snack.calories, 0);
    
    return `
        <div class="meal-card">
            <div class="meal-header">
                <div class="meal-icon">🍎</div>
                <div class="meal-title">
                    <h3>Snacks</h3>
                    <span>Mid-morning & Evening</span>
                </div>
                <div class="meal-calories">
                    <div class="value">${totalCalories}</div>
                    <div class="label">kcal</div>
                </div>
            </div>
            <div class="meal-content">
                ${snacks.map(snack => `
                    <div class="meal-item">
                        <div class="meal-item-header">
                            <h4>${snack.name}</h4>
                            <span class="meal-item-calories">${snack.calories} kcal</span>
                        </div>
                        <p>${snack.description}</p>
                        <div class="meal-macros">
                            <span class="macro">
                                <span class="macro-dot protein"></span>
                                Protein: ${snack.protein}
                            </span>
                            <span class="macro">
                                <span class="macro-dot carbs"></span>
                                Carbs: ${snack.carbs}
                            </span>
                            <span class="macro">
                                <span class="macro-dot fat"></span>
                                Fat: ${snack.fat}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Show loading state
function showLoading() {
    resultsSection.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Generating your personalized diet plan...</p>
        </div>
    `;
}

// Show alert message
function showAlert(message) {
    alert(message);
}

// Show error message
function showError(message) {
    resultsSection.innerHTML = `
        <div class="results-placeholder">
            <div class="placeholder-icon">⚠️</div>
            <div class="placeholder-text">
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
            </div>
        </div>
    `;
}
