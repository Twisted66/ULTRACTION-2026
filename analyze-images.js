import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = './public/images/projects';
const outputFile = './image-analysis.json';

async function analyzeImages() {
  const files = fs.readdirSync(imagesDir)
    .filter(file => /\.(jpeg|jpg|png)$/i.test(file));

  console.log(`Analyzing ${files.length} images...`);

  const results = [];

  for (const file of files) {
    const filepath = path.join(imagesDir, file);
    const stats = fs.statSync(filepath);

    try {
      const metadata = await sharp(filepath).metadata();

      const width = metadata.width;
      const height = metadata.height;
      const aspectRatio = width / height;
      const megapixels = (width * height) / 1000000;
      const fileSizeKB = stats.size / 1024;

      let orientation, quality;

      if (aspectRatio > 1.2) {
        orientation = 'horizontal';
      } else if (aspectRatio < 0.8) {
        orientation = 'vertical';
      } else {
        orientation = 'square';
      }

      if (megapixels >= 2 && fileSizeKB > 100) {
        quality = 'high';
      } else if (megapixels >= 1 && fileSizeKB > 50) {
        quality = 'medium';
      } else {
        quality = 'low';
      }

      let recommendedUse;
      if (orientation === 'horizontal' && quality === 'high') {
        recommendedUse = 'hero, featured-project, gallery-wide';
      } else if (orientation === 'horizontal' && quality === 'medium') {
        recommendedUse = 'project-card-med, gallery-wide';
      } else if (orientation === 'vertical') {
        recommendedUse = 'project-card-tall, portrait-showcase';
      } else {
        recommendedUse = 'thumbnail, grid, project-card-short';
      }

      results.push({
        file,
        width,
        height,
        aspectRatio: aspectRatio.toFixed(2),
        orientation,
        quality,
        megapixels: megapixels.toFixed(1),
        fileSizeKB: fileSizeKB.toFixed(0),
        recommendedUse,
        format: metadata.format
      });

      console.log(`✓ ${file}: ${orientation} (${width}x${height}) - ${quality}`);
    } catch (error) {
      results.push({
        file,
        error: error.message
      });
      console.log(`✗ ${file}: Error - ${error.message}`);
    }
  }

  // Summary statistics
  const horizontal = results.filter(r => r.orientation === 'horizontal');
  const vertical = results.filter(r => r.orientation === 'vertical');
  const square = results.filter(r => r.orientation === 'square');
  const highQuality = results.filter(r => r.quality === 'high');
  const mediumQuality = results.filter(r => r.quality === 'medium');
  const lowQuality = results.filter(r => r.quality === 'low');

  const summary = {
    total: results.length,
    horizontal: horizontal.length,
    vertical: vertical.length,
    square: square.length,
    highQuality: highQuality.length,
    mediumQuality: mediumQuality.length,
    lowQuality: lowQuality.length
  };

  const output = {
    summary,
    images: results
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

  console.log('\n=== Analysis Summary ===');
  console.log(`Total Images: ${summary.total}`);
  console.log(`Horizontal: ${summary.horizontal} (${(summary.horizontal/summary.total*100).toFixed(1)}%)`);
  console.log(`Vertical: ${summary.vertical} (${(summary.vertical/summary.total*100).toFixed(1)}%)`);
  console.log(`Square: ${summary.square} (${(summary.square/summary.total*100).toFixed(1)}%)`);
  console.log(`\nQuality Distribution:`);
  console.log(`High Quality: ${summary.highQuality} (${(summary.highQuality/summary.total*100).toFixed(1)}%)`);
  console.log(`Medium Quality: ${summary.mediumQuality} (${(summary.mediumQuality/summary.total*100).toFixed(1)}%)`);
  console.log(`Low Quality: ${summary.lowQuality} (${(summary.lowQuality/summary.total*100).toFixed(1)}%)`);
  console.log(`\nResults saved to: ${outputFile}`);
}

analyzeImages().catch(console.error);
