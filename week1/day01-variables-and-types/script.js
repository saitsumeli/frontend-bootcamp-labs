const LS_KEY = "day1-user-form";
const form = document.getElementById("userForm");
const result = document.getElementById("result");

const inputs = {
    name: document.getElementById("nameInput"),
    email: document.getElementById("emailInput"),
    age: document.getElementById("ageInput"),
    highSchool: document.getElementById("highSchoolInput"),
};

// Sayfa açıldığında localStorage'dan yükle
document.addEventListener("DOMContentLoaded", () => {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    Object.keys(inputs).forEach(key => {
        if (saved[key]) inputs[key].value = saved[key];
    });
    if (Object.keys(saved).length) render(saved);
});

// Form submit edildiğinde kaydet + göster
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        name: inputs.name.value.trim(),
        email: inputs.email.value.trim(),
        age: inputs.age.value.trim() === "" ? "" : Number(inputs.age.value.trim()),
        highSchool: inputs.highSchool.value.trim(),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    render(data);
});

function render(d) {
    result.innerHTML = `
        <h3>Özet</h3>
        <p><strong>Full Name:</strong> ${d.name || "-"}</p>
        <p><strong>E-Mail:</strong> ${d.email || "-"}</p>
        <p><strong>Age:</strong> ${d.age === "" ? "-" : d.age}</p>
        <p><strong>High School:</strong> ${d.highSchool || "-"}</p>

        <h4>Type Inspector</h4>
        <ul>
            <li>typeof name → <code>${typeof d.name}</code></li>
            <li>typeof email → <code>${typeof d.email}</code></li>
            <li>typeof age → <code>${typeof d.age}</code></li>
            <li>typeof highSchool → <code>${typeof d.highSchool}</code></li>
        </ul>

        <p class="summary">
            ${summaryLine(d)}
        </p>
    `;
}

function summaryLine(d) {
    const name = d.name || "—";
    const email = d.email || "—";
    const age = d.age === "" ? "—" : (Number.isNaN(d.age) ? "NaN" : d.age);
    const hs = d.highSchool || "—";
    return `Kullanıcı "${name}" (${email}), yaş: ${age}, mezun olduğu lise: "${hs}".`;
}
