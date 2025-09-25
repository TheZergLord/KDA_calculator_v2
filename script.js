// === CALCULADORA KDA - HUNT SHOWDOWN 1896 ===

class HuntKDACalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.addThematicEffects();
    }

    initializeElements() {
        // Elementos de entrada
        this.kdaInput = document.getElementById('kda-input');
        this.killsInput = document.getElementById('kills-input');
        this.deathsInput = document.getElementById('deaths-input');
        this.assistsInput = document.getElementById('assists-input');
        
        // Elementos de controle
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsSection = document.getElementById('results-section');
        this.resultsContent = document.getElementById('results-content');
    }

    bindEvents() {
        this.calculateBtn.addEventListener('click', () => this.calculateKDA());
        
        // Enter key nos inputs
        [this.kdaInput, this.killsInput, this.deathsInput, this.assistsInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculateKDA();
                }
            });
        });

        // Auto-cálculo quando KDA bruto for alterado
        this.kdaInput.addEventListener('input', () => {
            if (this.kdaInput.value) {
                this.clearDetailedInputs();
            }
        });

        // Limpar KDA bruto quando inputs detalhados forem usados
        [this.killsInput, this.deathsInput, this.assistsInput].forEach(input => {
            input.addEventListener('input', () => {
                if (input.value) {
                    this.kdaInput.value = '';
                }
            });
        });
    }

    clearDetailedInputs() {
        this.killsInput.value = '';
        this.deathsInput.value = '';
        this.assistsInput.value = '';
    }

    calculateKDA() {
        try {
            let result = '';
            
            // Verificar se está usando KDA bruto ou inputs detalhados
            if (this.kdaInput.value) {
                result = this.calculateFromRawKDA();
            } else {
                result = this.calculateFromDetailed();
            }

            this.displayResult(result);
            this.playCalculationEffect();

        } catch (error) {
            this.showError(error.message);
        }
    }

    calculateFromRawKDA() {
        const rawKDA = parseFloat(this.kdaInput.value);
        
        if (isNaN(rawKDA) || rawKDA < 0) {
            throw new Error('Digite um KDA válido (ex: 1.38)');
        }

        let result = `<div class="kda-display">KDA Atual: ${rawKDA.toFixed(3)}</div>`;
        
        result += this.generateKDAAnalysis(rawKDA);
        result += this.generateImprovementSuggestions(rawKDA);
        result += this.generateRankingComparison(rawKDA);
        
        return result;
    }

    calculateFromDetailed() {
        const kills = parseInt(this.killsInput.value) || 0;
        const deaths = parseInt(this.deathsInput.value) || 0;
        const assists = parseInt(this.assistsInput.value) || 0;

        if (kills < 0 || deaths < 0 || assists < 0) {
            throw new Error('Valores não podem ser negativos, Caçador!');
        }

        let kda, kdaDisplay;
        
        if (deaths === 0) {
            kda = Infinity;
            kdaDisplay = '∞';
        } else {
            kda = (kills + assists) / deaths;
            kdaDisplay = kda.toFixed(3);
        }

        let result = `<div class="kda-display">KDA Calculado: ${kdaDisplay}</div>`;
        result += `<div class="stat-line">📊 <span class="stat-highlight">Kills:</span> ${kills}</div>`;
        result += `<div class="stat-line">💀 <span class="stat-highlight">Deaths:</span> ${deaths}</div>`;
        result += `<div class="stat-line">🤝 <span class="stat-highlight">Assists:</span> ${assists}</div>`;
        
        if (deaths > 0) {
            result += this.generateImprovementCalculations(kills, deaths, assists, kda);
        } else {
            result += `<div class="stat-line">⚡ Com 0 mortes, qualquer kill manterá KDA infinito!</div>`;
            result += `<div class="stat-line">🎯 Para ter um KDA específico, você precisa de pelo menos 1 morte.</div>`;
        }

        result += this.generateRankingComparison(kda === Infinity ? 10 : kda);
        
        return result;
    }

    generateKDAAnalysis(kda) {
        let analysis = '<div style="margin: 1.5rem 0; padding: 1rem; background: rgba(255, 107, 53, 0.1); border-radius: 5px;">';
        analysis += '<h4 style="color: var(--text-orange); margin-bottom: 0.5rem;">📈 Análise de Performance</h4>';
        
        if (kda >= 3.0) {
            analysis += '<p>🏆 <strong>Lendário!</strong> Você é um veterano temido nos pântanos!</p>';
        } else if (kda >= 2.0) {
            analysis += '<p>⭐ <strong>Excelente!</strong> Seu nome ecoa pelas tavernas de Louisiana!</p>';
        } else if (kda >= 1.5) {
            analysis += '<p>🎯 <strong>Sólido!</strong> Um caçador respeitável e competente!</p>';
        } else if (kda >= 1.0) {
            analysis += '<p>⚖️ <strong>Equilibrado!</strong> Você se mantém firme na luta!</p>';
        } else if (kda >= 0.5) {
            analysis += '<p>🔥 <strong>Em Desenvolvimento!</strong> Cada morte te ensina algo novo!</p>';
        } else {
            analysis += '<p>💀 <strong>Novato Corajoso!</strong> Os pântanos são cruéis, mas você persiste!</p>';
        }
        
        analysis += '</div>';
        return analysis;
    }

    generateImprovementSuggestions(kda) {
        let suggestions = '<div style="margin: 1.5rem 0; padding: 1rem; background: rgba(196, 30, 58, 0.1); border-radius: 5px;">';
        suggestions += '<h4 style="color: var(--text-red); margin-bottom: 0.5rem;">🎯 Caminhos para Melhoria</h4>';
        
        // Estimativas baseadas no KDA atual
        const killsNeeded001 = Math.ceil(kda * 100 * 0.01); // Estimativa para +0.01 KDA
        const killsNeeded01 = Math.ceil(kda * 100 * 0.1);   // Estimativa para +0.1 KDA
        
        suggestions += `<div class="stat-line">🔸 Para KDA ${(kda + 0.01).toFixed(2)}: ~${killsNeeded001} kills sem morrer</div>`;
        suggestions += `<div class="stat-line">🔸 Para KDA ${(kda + 0.1).toFixed(2)}: ~${killsNeeded01} kills sem morrer</div>`;
        suggestions += `<div class="stat-line">🔸 Para KDA ${(kda + 0.5).toFixed(2)}: foque em sobrevivência e assists</div>`;
        
        suggestions += '</div>';
        return suggestions;
    }

    generateImprovementCalculations(kills, deaths, assists, currentKDA) {
        let improvements = '<div style="margin: 1.5rem 0; padding: 1rem; background: rgba(196, 30, 58, 0.1); border-radius: 5px;">';
        improvements += '<h4 style="color: var(--text-red); margin-bottom: 0.5rem;">🎯 Planos de Melhoria</h4>';
        
        // Cálculos precisos baseados na lógica Python
        const killsFor001NoDeath = this.calculateKillsForKDAIncrease(kills, deaths, assists, 0.01, 0);
        const killsFor001With10Deaths = this.calculateKillsForKDAIncrease(kills, deaths, assists, 0.01, 10);
        const killsFor001With20Deaths = this.calculateKillsForKDAIncrease(kills, deaths, assists, 0.01, 20);
        
        improvements += `<div class="stat-line">⚔️ Para +0.01 KDA (sem morrer): <span class="stat-highlight">${killsFor001NoDeath} kills</span></div>`;
        improvements += `<div class="stat-line">💀 Para +0.01 KDA (com 10 mortes): <span class="stat-highlight">${killsFor001With10Deaths} kills</span></div>`;
        improvements += `<div class="stat-line">🩸 Para +0.01 KDA (com 20 mortes): <span class="stat-highlight">${killsFor001With20Deaths} kills</span></div>`;
        
        improvements += '</div>';
        return improvements;
    }

    calculateKillsForKDAIncrease(currentKills, currentDeaths, currentAssists, increase, futureDeaths) {
        if (currentDeaths === 0) return 0;
        
        const currentKDA = (currentKills + currentAssists) / currentDeaths;
        const targetKDA = currentKDA + increase;
        const totalDeaths = currentDeaths + futureDeaths;
        const requiredTotalKillsAssists = targetKDA * totalDeaths;
        const requiredAdditionalKills = requiredTotalKillsAssists - currentKills - currentAssists;
        
        return Math.max(0, Math.ceil(requiredAdditionalKills));
    }

    generateRankingComparison(kda) {
        let ranking = '<div style="margin: 1.5rem 0; padding: 1rem; background: rgba(255, 170, 68, 0.1); border-radius: 5px;">';
        ranking += '<h4 style="color: var(--text-orange); margin-bottom: 0.5rem;">🏅 Classificação entre Caçadores</h4>';
        
        const ranks = [
            { min: 3.0, title: "🏆 Lenda Viva", desc: "Top 1% - Terror dos Bayous" },
            { min: 2.5, title: "💀 Ceifador", desc: "Top 5% - Mestre da Caça" },
            { min: 2.0, title: "⭐ Veterano Elite", desc: "Top 15% - Temido e Respeitado" },
            { min: 1.5, title: "🎯 Caçador Experiente", desc: "Top 35% - Sólido e Confiável" },
            { min: 1.0, title: "⚖️ Sobrevivente", desc: "Mediano - Se Mantém Vivo" },
            { min: 0.5, title: "🔥 Aprendiz", desc: "Em Crescimento" },
            { min: 0.0, title: "💀 Novato", desc: "Todo Caçador Começou Assim" }
        ];
        
        const currentRank = ranks.find(rank => kda >= rank.min) || ranks[ranks.length - 1];
        const nextRank = ranks.find(rank => rank.min > kda);
        
        ranking += `<div class="stat-line">📍 <strong>Rank Atual:</strong> ${currentRank.title}</div>`;
        ranking += `<div class="stat-line">📝 ${currentRank.desc}</div>`;
        
        if (nextRank) {
            const kdaNeeded = (nextRank.min - kda).toFixed(2);
            ranking += `<div class="stat-line">🎯 <strong>Próximo Rank:</strong> ${nextRank.title} (precisa de +${kdaNeeded} KDA)</div>`;
        }
        
        ranking += '</div>';
        return ranking;
    }

    displayResult(htmlContent) {
        this.resultsContent.innerHTML = htmlContent;
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showError(message) {
        const errorHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-red);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                <div style="font-size: 1.2rem; font-weight: bold;">${message}</div>
                <div style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                    Verifique os valores e tente novamente, Caçador.
                </div>
            </div>
        `;
        this.displayResult(errorHTML);
    }

    playCalculationEffect() {
        // Efeito visual no botão
        this.calculateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.calculateBtn.style.transform = '';
        }, 150);

        // Efeito de "sangue" nos resultados
        this.resultsSection.style.borderColor = 'var(--accent-red)';
        setTimeout(() => {
            this.resultsSection.style.borderColor = 'var(--accent-red)';
        }, 1000);
    }

    addThematicEffects() {
        // Efeito de digitação nos placeholders
        const placeholderTexts = [
            "Quantos inimigos caíram...",
            "Suas mortes no bayou...",
            "Caçadores que ajudou..."
        ];

        [this.killsInput, this.deathsInput, this.assistsInput].forEach((input, index) => {
            if (index < placeholderTexts.length) {
                this.typewriterEffect(input, placeholderTexts[index]);
            }
        });

        // Sons temáticos (simulados com vibração se disponível)
        this.calculateBtn.addEventListener('click', () => {
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        });

        // Efeito de hover nos inputs
        [this.kdaInput, this.killsInput, this.deathsInput, this.assistsInput].forEach(input => {
            input.addEventListener('mouseenter', () => {
                input.style.boxShadow = '0 0 15px var(--accent-orange)';
            });
            
            input.addEventListener('mouseleave', () => {
                if (input !== document.activeElement) {
                    input.style.boxShadow = '';
                }
            });
        });
    }

    typewriterEffect(element, text) {
        element.addEventListener('focus', () => {
            if (!element.value) {
                let i = 0;
                const originalPlaceholder = element.placeholder;
                element.placeholder = '';
                
                const typeInterval = setInterval(() => {
                    element.placeholder += text[i];
                    i++;
                    if (i >= text.length) {
                        clearInterval(typeInterval);
                        setTimeout(() => {
                            element.placeholder = originalPlaceholder;
                        }, 2000);
                    }
                }, 100);
            }
        });
    }
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
    new HuntKDACalculator();
    
    // Mensagem de boas-vindas no console
    console.log(`
    🕯️ Hunt Showdown 1896 - Calculadora KDA 🕯️
    
    "Os mortos sussurram segredos nos bayous de Louisiana...
     Cada número conta uma história de sangue e sobrevivência."
    
    Que a sorte esteja com você, Caçador.
    `);
});

// === EFEITOS EXTRAS ===

// Partículas flutuantes desabilitadas para performance
function createFloatingParticles() {
    // Desabilitado para evitar borrões de luz
    return;
}

// Iniciar partículas após carregamento
setTimeout(createFloatingParticles, 1000);