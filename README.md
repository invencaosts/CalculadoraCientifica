# Calculadora Científica

Uma **Calculadora Científica** desenvolvida com **Next.js**, **React**, **TypeScript** e **Tailwind CSS**, capaz de realizar cálculos básicos, científicos e avançados, com suporte a teclado e histórico de operações.

---

## **Visão Geral**

A aplicação possui:

- **Modos de cálculo**:
  - **Padrão**: Operações básicas (`+`, `-`, `×`, `÷`, `%`, `±`, `C`).
  - **Científica**: Funções trigonométricas (`sin`, `cos`, `tan`), logaritmos (`ln`, `log`), exponenciais, potências e máximos/mínimos.
  - **Avançada**: Limites e integrais definidas, com inputs de expressão, variável e intervalos.
- **Histórico** das operações realizadas.
- **Entrada via teclado**, compatível com números, operadores e comandos (`Enter`, `Escape`, `+`, `-`, `*`, `/`).
- **Design moderno**, com bloco central destacado sobre fundo gradiente e seleção visual dos modos.

---

## **Tecnologias Utilizadas**

| Tecnologia      | Função |
|-----------------|--------|
| **Next.js**     | Estrutura do projeto, roteamento, SSR/SSG. |
| **React**       | Componentização, gerenciamento de estado e eventos. |
| **TypeScript**  | Tipagem estática e segurança de código. |
| **Tailwind CSS**| Estilização rápida e responsiva via classes utilitárias. |
| **JavaScript**  | Parser e avaliador de expressões matemáticas. |

---


---

## **Como Funciona**

1. **Parser de expressões**:  
   - O input do usuário é tokenizado, convertendo números, operadores e parênteses.
   - As expressões são transformadas em **RPN (Reverse Polish Notation)**.
   - O RPN é avaliado para retornar o resultado final.

2. **Entrada de teclado**:  
   - Suporte para números, operadores (`+`, `-`, `×`, `÷`), `Enter` para `=`, `Escape` para limpar, `.` para decimal.
   - Atualiza o display em tempo real.

3. **Histórico de cálculos**:  
   - Cada operação realizada é adicionada a um histórico exibido abaixo da calculadora.

4. **Modos de cálculo**:  
   - **Padrão**: Calculadora básica.
   - **Científica**: Adiciona funções matemáticas avançadas.
   - **Avançada**: Inputs separados para limites e integrais definidas.

---

## **Casos de Teste**

### Básico
| Entrada | Resultado Esperado |
|---------|------------------|
| `1 + 2 =` | `3` |
| `5 × 6 =` | `30` |
| `9 ÷ 3 =` | `3` |
| `±` após `5` | `-5` |
| `%` após `50` | `0.5` |
| `C` | limpa display |

### Científico
| Entrada | Resultado Esperado |
|---------|------------------|
| `sin(π/2) =` | `1` |
| `cos(0) =` | `1` |
| `ln(e) =` | `1` |
| `log(100) =` | `2` |

### Avançado
- **Limites:** `(x^2 - 1)/(x - 1)` com x → 1, resultado esperado `2`.
- **Integrais:** `x^2`, limite inferior 0, superior 2, resultado esperado `8/3 ≈ 2.6667`.

---

