// Bloquear o botão direito do mouse
document.addEventListener("contextmenu", e => e.preventDefault());

// Bloquear teclas específicas: F12, CTRL+I, CTRL+S, CTRL+U
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (
        e.key === "F12" ||
        (e.ctrlKey && (key === "i" || key === "s" || key === "u"))
    ) {
        e.preventDefault();
        alert("ERRO303: Esta ação está bloqueada.");
    }
});

// Função para redirecionar caso as DevTools sejam detectadas
function redirectOnDevTools() {
    window.location.replace("about:blank");  // Redireciona para uma página em branco
}

(function detectDevTools() {
    let devToolsOpen = false;

    // Método 1: Usando getter em um objeto
    const checkDevTools = () => {
        const element = new Image();
        Object.defineProperty(element, "id", {
            get: () => {
                devToolsOpen = true;
                redirectOnDevTools();  // Redireciona caso as DevTools sejam abertas
            }
        });
        console.log(element);
    };

    // Método 2: Medindo a performance com "debugger"
    const checkPerformance = () => {
        const start = performance.now();
        debugger;  // Se o console estiver aberto, a execução pode pausar aqui
        const end = performance.now();
        if (end - start > 100) {
            devToolsOpen = true;
            redirectOnDevTools();  // Redireciona caso o console seja detectado
        }
    };

    // Verificações imediatas na carga do site
    checkDevTools();
    checkPerformance();

    // Verificação contínua a cada 500ms
    setInterval(() => {
        devToolsOpen = false;
        checkDevTools();
        checkPerformance();
    }, 500);
})();
