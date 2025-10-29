# Apple ML Research Figures - Screenshot & Video Capture

This script captures screenshots and videos of interactive figures from Apple Machine Learning research papers for portfolio presentation.

## Figures to Capture

### Latent Language Diffusion Model (3 figures)
- [Figure 1](https://machinelearning.apple.com/research/latent-language-diffusion-model#figure1)
- [Figure 2](https://machinelearning.apple.com/research/latent-language-diffusion-model#figure2)
- [Figure 3](https://machinelearning.apple.com/research/latent-language-diffusion-model#figure3)

### Personalized Heart Rate (2 figures)
- [Figure 1](https://machinelearning.apple.com/research/personalized-heartrate#figure1)
- [Figure 2](https://machinelearning.apple.com/research/personalized-heartrate#figure2)

### Humanizing WER (1 figure)
- [Figure 3](https://machinelearning.apple.com/research/humanizing-wer#figure3)

## Prerequisites

- Node.js (v18 or higher)
- npm

## Setup

Run the setup command to install dependencies and browser binaries:

```bash
npm run setup
```

Or manually:

```bash
# Install npm dependencies
npm install

# Install Playwright browser (Chromium)
npm run install-browsers
```

## Usage

### Capture All Figures

```bash
npm run capture
```

This will:
1. Navigate to each figure URL
2. Wait for interactive components to load
3. Take initial screenshots of each figure
4. Detect and interact with buttons, sliders, and other controls
5. Capture screenshots after each interaction
6. Save full-page screenshots
7. Generate trace files for reviewing interactions

### Output

Screenshots and videos are saved to:
- `screenshots/` - PNG screenshots of figures and interactions
- `videos/` - WebM videos and trace files of interactions

### File Naming Convention

- `{figure-name}-initial.png` - Initial state of the figure
- `{figure-name}-interaction-{n}.png` - Screenshot after nth interaction
- `{figure-name}-slider-{n}.png` - Screenshot of slider interactions
- `{figure-name}-full.png` - Full page screenshot
- `{figure-name}-trace.zip` - Playwright trace file (open with `npx playwright show-trace`)

## Viewing Trace Files

Trace files contain a complete recording of the browser interactions:

```bash
npx playwright show-trace videos/{figure-name}-trace.zip
```

This opens an interactive viewer showing:
- Timeline of all actions
- Screenshots at each step
- Network activity
- Console logs
- DOM snapshots

## Customization

Edit `capture-figures.js` to:
- Add more figures to the `figures` array
- Adjust viewport size (default: 1920x1080 @ 2x scale)
- Modify interaction logic
- Change output formats
- Add custom interactions for specific figures

## Troubleshooting

**Browser download fails:**
- Ensure you have internet connectivity
- Try running `npx playwright install chromium --force`

**Figures not loading:**
- Increase timeout in `page.goto()` options
- Check if the figure IDs have changed on the website

**Interactive elements not detected:**
- Inspect the page HTML and update selectors in the script
- Add specific selectors for known interactive components

## Portfolio Integration

After capturing, you can:
1. Review all screenshots in the `screenshots/` directory
2. Select the best representations of each figure
3. Add them to your portfolio with proper attribution
4. Link back to the original research papers

## Attribution

All figures are from Apple Machine Learning Research:
- https://machinelearning.apple.com

Make sure to credit Apple and link to the original research papers when using these in your portfolio.
