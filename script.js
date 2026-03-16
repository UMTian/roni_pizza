// Initialize Lucide icons
lucide.createIcons();

// Elements
const pizzaWrapper = document.querySelector('.main-pizza-wrapper');
const pizzaImg = document.getElementById('traveling-pizza');
const spot2 = document.getElementById('pizza-spot-2');
const spot3 = document.getElementById('pizza-spot-3');
const spot4 = document.getElementById('pizza-spot-4');
const spot5 = document.getElementById('pizza-spot-5');
const cheeseMozLayer = document.getElementById('cheese-moz-layer');
const cheeseChadderLayer = document.getElementById('cheese-chadder-layer');
const cheeseParmezanLayer = document.getElementById('cheese-parmezan-layer');
const hero = document.querySelector('.hero');

// Pizza Data
const pizzaData = [
    {
        title: "Your Delicious Pizza <br> Start Here!",
        subtitle: "Gather your friends, and family and enjoy the best pizza in <br> town. Freshly made and delivered hot.",
        image: "pizza.png"
    },
    {
        title: "The Ultimate <br> Pepperoni Feast",
        subtitle: "Loaded with premium pepperoni, melted mozzarella, and our signature <br> tomato sauce on a crispy golden crust.",
        image: "pepparoni.png"
    },
    {
        title: "Classic <br> Margherita Bliss",
        subtitle: "The timeless Italian favorite with fresh basil, creamy mozzarella, <br> and sun-ripened tomatoes.",
        image: "margarita.png"
    },
    {
        title: "Tropical <br> Hawaii Paradise",
        subtitle: "A sweet and savory combination of juicy pineapples, smoked ham, <br> and a blend of aromatic cheeses.",
        image: "hawaii.png"
    },
    {
        title: "Fresh <br> Garden Vegetable",
        subtitle: "Bursting with color and flavor — bell peppers, olives, mushrooms, <br> and onions on a bed of fresh dough.",
        image: "vegetable.png"
    }
];

let currentPizzaIndex = 0;

// UI Elements for updates
const heroTitle = document.querySelector('.hero-title');
const prevBtn = document.getElementById('prev-pizza');
const nextBtn = document.getElementById('next-pizza');

let isSwitching = false;
let isBaked = false;

// Initialize explicitly
if (pizzaImg) pizzaImg.src = pizzaData[0].image;
if (heroTitle) heroTitle.innerHTML = pizzaData[0].title;

// --- SECTION 3 CAROUSEL LOGIC ---
const carouselPizzas = document.querySelectorAll('.carousel-pizza');
const lineupName = document.getElementById('lineup-name');
const lineupDesc = document.getElementById('lineup-desc');
const lineupPrice = document.getElementById('lineup-price');
const menuPrevBtn = document.querySelector('.prev-btn');
const menuNextBtn = document.querySelector('.next-btn');

function updateLineup() {
    const total = pizzaData.length;

    // Animate physically shifting pizzas like a 3D GSAP transform carousel
    if (carouselPizzas.length) {
        carouselPizzas.forEach((img, i) => {
            let diff = (i - currentPizzaIndex) % total;

            // Allow wrapping properly in the shortest path
            if (diff > 2) diff -= total;
            if (diff < -2) diff += total;

            // Base transform values per slot
            let tx = diff * 280;
            let scale = 1; // Don't scale, so they remain the same size as the placeholder
            let opacity = 0.6;
            let rotate = diff * 180; // Significantly enhanced rotation to simulate a rolling carousel wheel
            let zIndex = 10 - Math.abs(diff);

            if (diff === 0) {
                // Center spot scales up to perfectly match the traveling pizza size
                opacity = 1;
                scale = 1.4; // 280px rendered size
                tx = 0;
                img.style.visibility = 'visible';
            } else {
                img.style.visibility = 'visible';
                if (Math.abs(diff) === 1) {
                    opacity = 0.8;
                } else if (Math.abs(diff) === 2) {
                    opacity = 0.4;
                }
            }

            img.style.zIndex = zIndex;
            img.style.transform = `translateX(${tx}px) scale(${scale}) rotate(${rotate}deg)`;
            img.style.opacity = opacity;
        });
    }

    const info = pizzaData[currentPizzaIndex];
    if (lineupName) lineupName.textContent = info.title.replace(/<br>/g, ' ');
    if (lineupDesc) lineupDesc.textContent = info.subtitle.replace(/<br>/g, ' ');
    // if (lineupPrice) lineupPrice.textContent = `$${(12 + currentPizzaIndex * 2).toFixed(2)}`;
}

// Menu Buttons
if (menuPrevBtn) {
    menuPrevBtn.onclick = () => {
        if (isSwitching) return;
        currentPizzaIndex = (currentPizzaIndex - 1 + pizzaData.length) % pizzaData.length;
        updatePizza(currentPizzaIndex, 'prev');
        updateLineup();
    };
}

if (menuNextBtn) {
    menuNextBtn.onclick = () => {
        if (isSwitching) return;
        currentPizzaIndex = (currentPizzaIndex + 1) % pizzaData.length;
        updatePizza(currentPizzaIndex, 'next');
        updateLineup();
    };
}

// Hero Buttons
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (isSwitching) return;
        currentPizzaIndex = (currentPizzaIndex - 1 + pizzaData.length) % pizzaData.length;
        updatePizza(currentPizzaIndex, 'prev');
        updateLineup(); // Always update lineup to prevent flavor duplication
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (isSwitching) return;
        currentPizzaIndex = (currentPizzaIndex + 1) % pizzaData.length;
        updatePizza(currentPizzaIndex, 'next');
        updateLineup(); // Always update lineup to prevent flavor duplication
    });
}

// Initialize lineup
updateLineup();

function updatePizza(index, direction = 'next') {
    // Only allow switching if at top or in menu (handled by buttons)
    // The user's constraint: if (window.scrollY > 100 || isSwitching) return;
    // We'll broaden it slightly to allow menu switching if we want, but let's stick to their Hero logic first.
    if (isSwitching) return;
    isSwitching = true;

    const pizza = pizzaData[index];
    const slideOutX = direction === 'next' ? '120%' : '-120%';
    const slideInX = direction === 'next' ? '-120%' : '120%';

    // Scale calculation based on current section
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    let targetScale = 1;
    if (scrollY > vh * 5.5) targetScale = 0.45; // Spot 5
    else if (scrollY > vh * 3.5) targetScale = 0.13; // Spot 4
    else if (scrollY > vh * 1.5) targetScale = 0.35; // Spot 3 (280px so it is visibly larger than 200px side pizzas)
    else if (scrollY > 100) targetScale = 0.5; // Spot 2

    // Step 1: Slide Out
    const isMenuSection = scrollY > vh * 1.5 && scrollY < vh * 3.5;

    if (isMenuSection) {
        // Just quietly vanish the wrapper pizza; the native carousel handles the physical animation!
        pizzaImg.style.transition = 'opacity 0.2s ease';
        pizzaImg.style.opacity = '0';
    } else {
        // Choreographed Slide-and-Rotate Exit
        const exitRotation = direction === 'next' ? 180 : -180;
        pizzaImg.style.transition = 'transform 0.9s cubic-bezier(0.45, 0, 0.55, 1), opacity 0.6s ease-in';
        pizzaImg.style.transform = `translateX(${slideOutX}) scale(${targetScale * 0.4}) rotate(${exitRotation}deg)`;
        pizzaImg.style.opacity = '0';
    }

    if (heroTitle && scrollY < vh) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(-10px)';
    }

    setTimeout(() => {
        // Step 2: Swap Image
        pizzaImg.style.transition = 'none';

        // If we are deep into the Section 4->5 transition or in Section 5, use dough
        const p4Start = vh * 4.9;
        const p4End = vh * 6.4;
        const progress4 = Math.max(0, Math.min((scrollY - p4Start) / (p4End - p4Start), 1));

        if (progress4 > 0.75 && !isBaked) {
            pizzaImg.src = 'dough.png';
        } else if (isBaked) {
            // Keep the baked pizza if it exists, otherwise use a safe default
            if (!pizzaImg.src.includes('png')) pizzaImg.src = pizzaData[0].image;
        } else {
            pizzaImg.src = pizza.image;
        }

        if (heroTitle && scrollY < vh) heroTitle.innerHTML = pizza.title;

        if (!isMenuSection) {
            const entryRotation = direction === 'next' ? -180 : 180;
            pizzaImg.style.transform = `translateX(${slideInX}) scale(${targetScale * 0.4}) rotate(${entryRotation}deg)`;
        } else {
            // Snap back to center seamlessly behind the native carousel pizza
            pizzaImg.style.transform = `translateX(0) scale(0.35) rotate(360deg)`;
            pizzaImg.style.opacity = '0';
        }
        pizzaImg.offsetHeight; // Reflow

        // Step 3: Slide In
        if (!isMenuSection) {
            pizzaImg.style.transition = 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s ease-out';
            pizzaImg.style.transform = `translateX(0) scale(${targetScale}) rotate(0deg)`;
            pizzaImg.style.opacity = '1';

            if (heroTitle && scrollY < vh) {
                setTimeout(() => {
                    heroTitle.style.opacity = '1';
                    heroTitle.style.transform = 'translateY(0)';
                }, 200); // Slight delay for choreographed feel
            }
        } else {
            // Carousel finished moving the exact same pizza to center, so un-vanish our traveling wrapper.
            pizzaImg.style.transition = 'opacity 0.2s ease';
            pizzaImg.style.opacity = '1';
        }

        if (heroTitle && scrollY < vh) {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }

        setTimeout(() => {
            isSwitching = false;
        }, 1200);
    }, 800);
}

function animatePizza() {
    if (isSwitching || !pizzaWrapper) return;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // --- PHASE 1: SECTION 1 -> SECTION 2 ---
    const progress1 = Math.max(0, Math.min(scrollY / windowHeight, 1));

    // --- PHASE 2: SECTION 2 -> SECTION 3 ---
    const p2Start = windowHeight * 1.3;
    const p2End = windowHeight * 2.8;
    const progress2 = Math.max(0, Math.min((scrollY - p2Start) / (p2End - p2Start), 1));

    // --- PHASE 3: SECTION 3 -> SECTION 4 ---
    const p3Start = windowHeight * 3.1;
    const p3End = windowHeight * 4.6;
    const progress3 = Math.max(0, Math.min((scrollY - p3Start) / (p3End - p3Start), 1));

    // --- PHASE 4: SECTION 4 -> SECTION 5 ---
    const p4Start = windowHeight * 4.9;
    const p4End = windowHeight * 6.4;
    const progress4 = Math.max(0, Math.min((scrollY - p4Start) / (p4End - p4Start), 1));

    // --- Dynamic Image Swap ---
    // When pizza is traveling from 4th to 5th section, convert to dough at the end.
    const originalImage = pizzaData[currentPizzaIndex].image;
    let targetSrc = originalImage;
    if (progress4 > 0.75 && !isBaked) {
        targetSrc = 'dough.png';
    } else if (isBaked) {
        // If baked, don't let it swap back to dough
        return;
    }

    if (pizzaImg && !pizzaImg.src.includes(targetSrc)) {
        pizzaImg.src = targetSrc;
    }

    if (progress1 < 1) {
        // --- TRAVELING 1 -> 2 ---
        if (!spot2) return;
        const targetRect = spot2.getBoundingClientRect();
        if (pizzaWrapper.parentElement !== document.body) document.body.appendChild(pizzaWrapper);

        const rotation = progress1 * 180;
        const scale = 1 - (progress1 * 0.5); // target 0.5
        pizzaWrapper.style.position = 'fixed';

        const startY = windowHeight - (pizzaWrapper.offsetHeight * 0.45);
        const targetY = targetRect.top + (targetRect.height / 2);
        const currentY = startY + (progress1 * (targetY - startY));

        const startX = window.innerWidth / 2;
        const targetX = targetRect.left + (targetRect.width / 2);
        const currentX = startX + (progress1 * (targetX - startX));

        pizzaWrapper.style.top = `${currentY}px`;
        pizzaWrapper.style.left = `${currentX}px`;
        pizzaWrapper.style.bottom = 'auto';

        const currentClip = 55 - (progress1 * 55);
        pizzaWrapper.style.transform = `translate(-50%, ${currentClip - 50}%)`;

        if (!isSwitching) pizzaImg.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }
    else if (progress2 === 0) {
        // --- LOCKED IN SECTION 2 ---
        pizzaWrapper.style.position = 'absolute';
        pizzaWrapper.style.top = '50%';
        pizzaWrapper.style.left = '50%';
        pizzaWrapper.style.bottom = 'auto';
        pizzaWrapper.style.transform = 'translate(-50%, -50%)';
        if (!isSwitching) pizzaImg.style.transform = 'rotate(180deg) scale(0.5)';
        if (spot2 && pizzaWrapper.parentElement !== spot2) spot2.appendChild(pizzaWrapper);
    }
    else if (progress2 < 1) {
        // --- TRAVELING 2 -> 3 ---
        if (!spot2 || !spot3) return;
        const startRect = spot2.getBoundingClientRect();
        const targetRect = spot3.getBoundingClientRect();
        if (pizzaWrapper.parentElement !== document.body) document.body.appendChild(pizzaWrapper);

        const rotation = 180 + (progress2 * 180);
        const scale = 0.5 + (progress2 * (0.35 - 0.5));
        pizzaWrapper.style.position = 'fixed';

        const startY = startRect.top + (startRect.height / 2);
        const targetY = targetRect.top + (targetRect.height / 2);
        const currentY = startY + (progress2 * (targetY - startY));

        const startX = startRect.left + (startRect.width / 2);
        const targetX = targetRect.left + (targetRect.width / 2);
        const currentX = startX + (progress2 * (targetX - startX));

        pizzaWrapper.style.top = `${currentY}px`;
        pizzaWrapper.style.left = `${currentX}px`;
        pizzaWrapper.style.transform = 'translate(-50%, -50%)';

        if (!isSwitching) pizzaImg.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }
    else if (progress3 === 0) {
        // --- LOCKED IN SECTION 3 ---
        pizzaWrapper.style.position = 'absolute';
        pizzaWrapper.style.top = '50%';
        pizzaWrapper.style.left = '50%';
        pizzaWrapper.style.transform = 'translate(-50%, -50%)';
        if (!isSwitching) pizzaImg.style.transform = 'rotate(360deg) scale(0.35)';
        if (spot3 && pizzaWrapper.parentElement !== spot3) spot3.appendChild(pizzaWrapper);
    }
    else if (progress3 < 1) {
        // --- TRAVELING 3 -> 4 ---
        if (!spot3 || !spot4) return;
        const startRect = spot3.getBoundingClientRect();
        const targetRect = spot4.getBoundingClientRect();
        if (pizzaWrapper.parentElement !== document.body) document.body.appendChild(pizzaWrapper);

        const rotation = 360 + (progress3 * 165);
        const scale = 0.35 + (progress3 * (0.13 - 0.35));
        pizzaWrapper.style.position = 'fixed';

        const startY = startRect.top + (startRect.height / 2);
        const targetY = targetRect.top + (targetRect.height / 2);
        const currentY = startY + (progress3 * (targetY - startY));

        const startX = startRect.left + (startRect.width / 2);
        const targetX = targetRect.left + (targetRect.width / 2);
        const currentX = startX + (progress3 * (targetX - startX));

        pizzaWrapper.style.top = `${currentY}px`;
        pizzaWrapper.style.left = `${currentX}px`;
        pizzaWrapper.style.transform = 'translate(-50%, -50%)';

        if (!isSwitching) pizzaImg.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }
    else if (progress4 === 0) {
        // --- LOCKED IN SECTION 4 ---
        pizzaWrapper.style.position = 'absolute';
        pizzaWrapper.style.top = '50%';
        pizzaWrapper.style.left = '50%';
        pizzaWrapper.style.transform = 'translate(-50%, -50%)';
        if (!isSwitching) pizzaImg.style.transform = 'rotate(525deg) scale(0.13)';
        if (spot4 && pizzaWrapper.parentElement !== spot4) spot4.appendChild(pizzaWrapper);
    }
    else if (progress4 < 1) {
        // --- TRAVELING 4 -> 5 ---
        if (!spot4 || !spot5) return;
        const startRect = spot4.getBoundingClientRect();
        const targetRect = spot5.getBoundingClientRect();
        if (pizzaWrapper.parentElement !== document.body) document.body.appendChild(pizzaWrapper);

        const rotation = 525 + (progress4 * 195);
        const scale = 0.13 + (progress4 * (0.525 - 0.13));
        pizzaWrapper.style.position = 'fixed';

        const startY = startRect.top + (startRect.height / 2);
        const targetY = targetRect.top + (targetRect.height * 0.4); // Target the circular part, not the handle
        const currentY = startY + (progress4 * (targetY - startY));

        const startX = startRect.left + (startRect.width / 2);
        const targetX = targetRect.left + (targetRect.width / 2);
        const currentX = startX + (progress4 * (targetX - startX));

        pizzaWrapper.style.top = `${currentY}px`;
        pizzaWrapper.style.left = `${currentX}px`;
        pizzaWrapper.style.transform = 'translate(-50%, -50%)';

        if (!isSwitching) pizzaImg.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }
    else {
        // --- LOCKED IN SECTION 5 (BUILDER) ---
        pizzaWrapper.style.position = 'absolute';
        pizzaWrapper.style.top = '40%'; // Align with the circular part of the board
        pizzaWrapper.style.left = '50%';
        pizzaWrapper.style.transform = 'translate(-50%, -50%)';
        if (!isSwitching) pizzaImg.style.transform = 'rotate(720deg) scale(0.525)';
        if (spot5 && pizzaWrapper.parentElement !== spot5) spot5.appendChild(pizzaWrapper);
    }
}

// --- BUILDER INTERACTION ---
const sauceLayer = document.getElementById('sauce-layer');
const cheeseLayer = document.getElementById('cheese-layer');
const toppingsLayer = document.getElementById('toppings-layer');
const tabBtns = document.querySelectorAll('.tab-btn');
const ingredientGroups = document.querySelectorAll('.ingredient-group');
const ingredientCards = document.querySelectorAll('.ingredient-card');
const priceTag = document.getElementById('custom-price');

let currentBasePrice = 12.00;
let toppingsCount = 0;

if (tabBtns) {
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            ingredientGroups.forEach(group => {
                group.classList.remove('active');
                if (group.id === `group-${category}`) group.classList.add('active');
            });
        };
    });
}

if (ingredientCards) {
    ingredientCards.forEach(card => {
        card.onclick = () => {
            card.classList.toggle('selected');
            const toppingId = card.dataset.topping;
            const type = card.dataset.type;
            const img = card.dataset.img;

            if (card.classList.contains('selected')) {
                if (type === 'sauce') {
                    document.querySelectorAll('.ingredient-card[data-type="sauce"]').forEach(c => {
                        if (c !== card) { c.classList.remove('selected'); }
                    });
                    applySauce(toppingId);
                } else if (type === 'cheese') {
                    applyCheese(toppingId, true);
                } else {
                    addTopping(toppingId, img);
                    toppingsCount++;
                }
            } else {
                if (type === 'sauce') {
                    if (sauceLayer) sauceLayer.classList.remove('active');
                } else if (type === 'cheese') {
                    applyCheese(toppingId, false);
                } else {
                    removeTopping(toppingId);
                    toppingsCount--;
                }
            }
            updatePrice();
        };
    });
}

function applySauce(id) {
    const sauceAssets = {
        'sauce-tomato': 'tomato_sause.png',
        'sauce-garlic': 'garlic_sause.png',
        'sauce-bbq': 'bbq_sause.png'
    };

    if (sauceLayer) {
        if (sauceAssets[id]) {
            sauceLayer.style.backgroundImage = `url('${sauceAssets[id]}')`;
            sauceLayer.style.backgroundColor = 'transparent';
        }
        sauceLayer.classList.add('active');
    }
}

function applyCheese(id, isSelected) {
    const cheeseAssets = {
        'cheese-moz': { layer: cheeseMozLayer, img: 'mozerela.png' },
        'cheese-cheddar': { layer: cheeseChadderLayer, img: 'chadder.png' },
        'cheese-parm': { layer: cheeseParmezanLayer, img: 'parmezan.png' }
    };

    const target = cheeseAssets[id];
    if (target && target.layer) {
        if (isSelected) {
            target.layer.style.backgroundImage = `url('${target.img}')`;
            target.layer.classList.add('active');
        } else {
            target.layer.classList.remove('active');
        }
    }
}

function addTopping(id, imgSrc) {
    if (!toppingsLayer) return;
    const count = 3 + Math.floor(Math.random() * 2); // 3-4 items
    const maxRadius = 140; // Relative to the 500x500 toppings layer
    const minRadius = 10;
    for (let i = 0; i < count; i++) {
        const topping = document.createElement('img');
        topping.src = imgSrc;
        topping.className = `floating-topping topping-${id}`;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * maxRadius;

        // The toppings layer is now centered at the dough (500x500)
        // So internal coordinates are relative to 250, 250
        const x = 250 + Math.cos(angle) * (radius + minRadius) - 17.5;
        const y = 250 + Math.sin(angle) * (radius + minRadius) - 17.5;

        topping.style.left = `${x}px`;
        topping.style.top = `${y}px`;
        topping.style.transform = `rotate(${Math.random() * 360}deg)`;

        // Make it draggable
        makeDraggable(topping);

        toppingsLayer.appendChild(topping);
    }
}

function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;
    // Add touch support
    el.ontouchstart = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        // Don't prevent default for touch to allow scrolling if needed, 
        // but here we probably want to prevent it to avoid scrolling while dragging.
        if (e.type === 'mousedown') e.preventDefault();

        // Get position
        if (e.type === 'touchstart') {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        } else {
            pos3 = e.clientX;
            pos4 = e.clientY;
        }

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDrag;

        el.style.cursor = 'grabbing';
        el.style.zIndex = '2000'; // Bring to front while dragging
    }

    function elementDrag(e) {
        e = e || window.event;

        let clientX, clientY;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Calculate the new cursor position
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;

        // Set the element's new position
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
        el.style.cursor = 'grab';
        el.style.zIndex = '1003';
    }
}

function removeTopping(id) {
    document.querySelectorAll(`.topping-${id}`).forEach(item => item.remove());
}

function updatePrice() {
    // if (priceTag) priceTag.textContent = `$${(currentBasePrice + (toppingsCount * 1.5)).toFixed(2)}`;
}

// Global Event Listeners
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            animatePizza();
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener('load', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    animatePizza();
    updateLineup();
});

window.addEventListener('resize', animatePizza);

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
});
// Keep Section 3 buttons visible once found
const menuCarousel = document.querySelector('.pizza-carousel-container');
if (menuCarousel) {
    menuCarousel.addEventListener('mouseenter', () => {
        menuCarousel.classList.add('nav-located');
    }, { once: true });
}

// Bake Button Logic
const bakeBtn = document.getElementById('bake-btn');
if (bakeBtn) {
    bakeBtn.addEventListener('click', () => {
        // Find a random pizza from the array
        const randomPizza = pizzaData[Math.floor(Math.random() * pizzaData.length)].image;

        // Stage 1: Swelling/Heat Glow Effect
        const pizzaCanvas = document.querySelector('.pizza-canvas');
        if (pizzaCanvas) pizzaCanvas.classList.add('baking-started');

        // Stage 2: Transform Dough and Board
        const doughBase = document.querySelector('.dough-base');
        const pizzaImg = document.getElementById('traveling-pizza'); // This is the dough after travel

        if (doughBase) {
            doughBase.style.transition = 'background-image 0.8s ease';
            doughBase.style.backgroundImage = "url('pan.png')";
        }

        if (pizzaImg) {
            // Animating the pizza "cooking"
            pizzaImg.style.transition = 'filter 3.0s ease, transform 3.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease';
            pizzaImg.style.transform += ' scale(1.05)';
            pizzaImg.style.filter = 'brightness(1.2) contrast(1.1) sepia(0.2)';

            setTimeout(() => {
                // Change to cooked pizza
                isBaked = true;
                pizzaImg.src = randomPizza;
                pizzaImg.style.filter = 'none';
                pizzaImg.style.transform = pizzaImg.style.transform.replace(' scale(1.05)', '');

                // Clear raw ingredients
                if (sauceLayer) sauceLayer.classList.remove('active');
                if (cheeseMozLayer) cheeseMozLayer.classList.remove('active');
                if (cheeseChadderLayer) cheeseChadderLayer.classList.remove('active');
                if (cheeseParmezanLayer) cheeseParmezanLayer.classList.remove('active');
                if (toppingsLayer) toppingsLayer.innerHTML = '';

                // Victory particles or reset glow
                if (pizzaCanvas) pizzaCanvas.classList.remove('baking-started');

                // Final success state
                bakeBtn.textContent = "Baked Perfect!";
            }, 3500); // Updated to 3.5 seconds
        }

        // Initial feedback
        bakeBtn.textContent = "Baking... 🔥";
        bakeBtn.disabled = true;
        bakeBtn.style.opacity = '0.7';
    });
}
