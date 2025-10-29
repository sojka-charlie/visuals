const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const figures = [
  {
    url: 'https://machinelearning.apple.com/research/latent-language-diffusion-model#figure1',
    name: 'latent-language-diffusion-figure1',
    paper: 'Latent Language Diffusion Model'
  },
  {
    url: 'https://machinelearning.apple.com/research/latent-language-diffusion-model#figure2',
    name: 'latent-language-diffusion-figure2',
    paper: 'Latent Language Diffusion Model'
  },
  {
    url: 'https://machinelearning.apple.com/research/latent-language-diffusion-model#figure3',
    name: 'latent-language-diffusion-figure3',
    paper: 'Latent Language Diffusion Model'
  },
  {
    url: 'https://machinelearning.apple.com/research/personalized-heartrate#figure1',
    name: 'personalized-heartrate-figure1',
    paper: 'Personalized Heart Rate'
  },
  {
    url: 'https://machinelearning.apple.com/research/personalized-heartrate#figure2',
    name: 'personalized-heartrate-figure2',
    paper: 'Personalized Heart Rate'
  },
  {
    url: 'https://machinelearning.apple.com/research/humanizing-wer#figure3',
    name: 'humanizing-wer-figure3',
    paper: 'Humanizing WER'
  }
];

async function captureInteractiveFigures() {
  // Create output directories
  const screenshotsDir = path.join(__dirname, 'screenshots');
  const videosDir = path.join(__dirname, 'videos');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2 // For retina quality screenshots
  });

  for (const figure of figures) {
    console.log(`\nProcessing: ${figure.name}`);
    console.log(`URL: ${figure.url}`);

    const page = await context.newPage();

    try {
      // Navigate to the page
      await page.goto(figure.url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for the figure to be visible and interactive components to load
      await page.waitForTimeout(3000);

      // Find the figure element
      const figureElement = await page.locator(`#${figure.url.split('#')[1]}`).first();

      if (await figureElement.count() > 0) {
        // Take initial screenshot of the figure
        const screenshotPath = path.join(screenshotsDir, `${figure.name}-initial.png`);
        await figureElement.screenshot({
          path: screenshotPath,
          animations: 'disabled'
        });
        console.log(`Screenshot saved: ${screenshotPath}`);

        // Start recording video of interactions
        const videoPath = path.join(videosDir, `${figure.name}-interaction.webm`);
        await page.video()?.saveAs(videoPath).catch(() => {
          console.log('Video recording not available, skipping...');
        });

        // Try to detect and interact with interactive elements
        const interactiveElements = await page.locator('button, input[type="range"], select, [role="slider"], [role="button"]').all();

        if (interactiveElements.length > 0) {
          console.log(`Found ${interactiveElements.length} interactive elements`);

          // Record interactions
          await page.context().tracing.start({ screenshots: true, snapshots: true });

          for (let i = 0; i < Math.min(interactiveElements.length, 5); i++) {
            try {
              const element = interactiveElements[i];
              const tagName = await element.evaluate(el => el.tagName);
              const type = await element.evaluate(el => el.type || el.getAttribute('role'));

              console.log(`  Interacting with ${tagName} (${type})`);

              // Hover and wait
              await element.hover();
              await page.waitForTimeout(500);

              // Click if it's a button
              if (tagName === 'BUTTON' || type === 'button') {
                await element.click();
                await page.waitForTimeout(1000);

                // Take screenshot after interaction
                const interactionScreenshot = path.join(screenshotsDir, `${figure.name}-interaction-${i + 1}.png`);
                await figureElement.screenshot({ path: interactionScreenshot });
                console.log(`  Interaction screenshot saved: ${interactionScreenshot}`);
              }

              // Handle sliders
              if (type === 'range' || type === 'slider') {
                // Get bounding box and simulate drag
                const box = await element.boundingBox();
                if (box) {
                  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
                  await page.mouse.down();
                  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.5);
                  await page.mouse.up();
                  await page.waitForTimeout(1000);

                  const sliderScreenshot = path.join(screenshotsDir, `${figure.name}-slider-${i + 1}.png`);
                  await figureElement.screenshot({ path: sliderScreenshot });
                  console.log(`  Slider interaction screenshot saved: ${sliderScreenshot}`);
                }
              }
            } catch (err) {
              console.log(`  Error interacting with element ${i}: ${err.message}`);
            }
          }

          await page.context().tracing.stop({ path: path.join(videosDir, `${figure.name}-trace.zip`) });
        }

        // Take final full-page screenshot
        const fullPageScreenshot = path.join(screenshotsDir, `${figure.name}-full.png`);
        await page.screenshot({
          path: fullPageScreenshot,
          fullPage: true
        });
        console.log(`Full page screenshot saved: ${fullPageScreenshot}`);

      } else {
        console.log(`Figure element not found for ${figure.name}`);
      }

    } catch (error) {
      console.error(`Error processing ${figure.name}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('\n✅ All figures processed!');
  console.log(`Screenshots saved to: ${screenshotsDir}`);
  console.log(`Videos/traces saved to: ${videosDir}`);
}

// Run the capture
captureInteractiveFigures().catch(console.error);
