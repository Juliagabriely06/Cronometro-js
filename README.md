# Cronômetro com voltas

Cronômetro feito com HTML, CSS e JavaScript puro, sem bibliotecas. Permite iniciar, pausar, zerar e registrar voltas, mostrando o tempo de cada volta e o tempo total. A volta mais rápida e a mais lenta ficam destacadas na lista.

Projeto criado para praticar manipulação de tempo, estado e DOM em JavaScript.

## Funcionalidades

- Iniciar, pausar, continuar e zerar o cronômetro
- Registro de voltas com tempo da volta e tempo total acumulado
- Destaque visual da volta mais rápida (verde) e da mais lenta (vermelho)
- Som simples nos botões, gerado pela Web Audio API, que pode ser desligado
- Atalhos de teclado
- Tema claro e escuro automático, de acordo com o sistema
- Layout responsivo

## Como usar

1. Baixe ou clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/cronometro.git
   ```

2. Abra o arquivo `index.html` no navegador.

Não há dependências nem etapa de instalação.

### Atalhos

| Tecla   | Ação                |
| ------- | ------------------- |
| Espaço  | Iniciar / pausar    |
| L       | Registrar volta     |
| R       | Zerar               |

## Estrutura do projeto

```
cronometro/
├── index.html   # estrutura da página
├── style.css    # visual, cores e tema escuro
└── script.js    # lógica do cronômetro
```

## Conceitos praticados

- **`setInterval` e `clearInterval`** para atualizar a tela a cada 10 ms
- **`performance.now()`** para medir o tempo real decorrido, evitando o atraso que aparece ao somar o intervalo a cada tick
- **`padStart`** para formatar o tempo como `mm:ss.cc`
- **Estado centralizado** em um único objeto, com a tela apenas "desenhando" esse estado
- **Manipulação dinâmica do DOM** com `createElement`, `append` e `replaceChildren`
- **`Math.min` e `Math.max`** para encontrar a volta mais rápida e a mais lenta
- **Eventos de teclado** com `keydown`
- **Web Audio API** (`OscillatorNode` e `GainNode`) para gerar sons sem arquivos de áudio

## Ideias para evoluir

- [ ] Salvar as voltas no `localStorage`
- [ ] Exportar as voltas em CSV
- [ ] Remover uma volta individualmente
- [ ] Mostrar a média das voltas
- [ ] Adicionar testes para a função `formatTime`

## Tecnologias

HTML5, CSS3 e JavaScript (ES6+).

## Autoria

Feito por Julia (@juliagabriely06).
