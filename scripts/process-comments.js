const fs = require('fs')
const path = require('path');

// Read CSV file
function readCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  // Get header row
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= headers.length) {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] ? values[index].replace(/"/g, '').trim() : '';
      });
      data.push(obj);
    }
  }
  
  return data;
}

// Parse CSV line, handle fields containing commas
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// Generate random data
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate() {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString();
}

function getRandomBoolean(probability = 0.5) {
  return Math.random() < probability;
}

// Generate product images
function generateProductImages() {
  const imageCount = getRandomInt(0, 8);
  const images = [];
  
  for (let i = 0; i < imageCount; i++) {
    images.push({
      url: `https://picsum.photos/400/400?random=${getRandomInt(1, 1000)}`,
      alt: `User uploaded image ${i + 1}`
    });
  }
  
  return images;
}

// Generate reply data
function generateReplies(commentId, replyCount = 0) {
  if (replyCount === 0) {
    replyCount = getRandomInt(0, 5);
  }
  
  const replies = [];
  const authors = ['John', 'Sarah', 'User123', 'Buyer456', 'ReviewExpert', 'RealUser'];
  
  for (let i = 0; i < replyCount; i++) {
    const reply = {
      id: getRandomInt(1000, 9999),
      author: authors[getRandomInt(0, authors.length - 1)],
      content: generateReplyContent(),
      timestamp: getRandomDate(),
      likes: getRandomInt(0, 20)
    };
    
    // 30% chance of nested replies
    if (Math.random() < 0.3) {
      reply.parentId = replies.length > 0 ? replies[getRandomInt(0, replies.length - 1)].id : undefined;
    }
    
    replies.push(reply);
  }
  
  return replies;
}

function generateReplyContent() {
  const replyTemplates = [
    'Thanks for sharing, very helpful review!',
    'I bought the same product, experience is indeed good',
    'Where did you buy it?',
    'How is the quality, worth buying?',
    'I agree, this product is really great',
    'Is the price reasonable? Any promotional activities?',
    'How about the packaging? Is shipping fast?',
    'I think the cost performance is very high',
    'Are there other color options?',
    'Used it for a while, indeed as the review said'
  ];
  
  return replyTemplates[getRandomInt(0, replyTemplates.length - 1)];
}

// Generate follow-up content
function generateFollowUp() {
  const followUpTemplates = [
    'After using for a week, overall satisfaction is still very high, recommend buying',
    'After long-term use, quality is indeed good, worth recommending',
    'Found some minor issues after a few days of use, but overall still satisfied',
    'Great value for money, good user experience, will repurchase',
    'Quality is stable, full-featured, meets expectations',
    'After comparison, this product indeed has advantages',
    'Good user experience, packaging is also exquisite',
    'Fast logistics, product quality also meets expectations'
  ];
  
  return {
    content: followUpTemplates[getRandomInt(0, followUpTemplates.length - 1)],
    timestamp: getRandomDate(),
    days_later: getRandomInt(3, 30)
  };
}

// Process comment data
function processComments(rawComments) {
  const processedComments = rawComments.map((comment, index) => {
    // Clean and process comment content
    const title = comment.title || comment.Title || comment.summary || comment.Summary || `Review ${index + 1}`;
    const body = comment.body || comment.Body || comment.content || comment.Content || comment.review || comment.Review;
    const reviewerName = comment.reviewer_name || comment['Reviewer Name'] || comment.author || comment.Author || `User${getRandomInt(1000, 9999)}`;
    
    // Generate rating (1-5 stars)
    const rating = getRandomInt(3, 5); // Bias towards high ratings
    
    // Generate helpful count
    const helpfulCount = getRandomInt(0, 50);
    
    // Generate like count
    const likes = getRandomInt(0, 30);
    
    // Whether verified purchase
    const verifiedPurchase = getRandomBoolean(0.8); // 80% verified purchases
    
    // Whether featured comment (high rating and high helpful count have higher probability)
    const featuredProbability = rating >= 4 && helpfulCount > 10 ? 0.3 : 0.1;
    const featured = getRandomBoolean(featuredProbability);
    
    // Generate timestamp
    const timestamp = getRandomDate();
    
    // Whether has images (30% probability)
    const hasImages = getRandomBoolean(0.3);
    const images = hasImages ? generateProductImages() : [];
    
    // Whether has replies (40% probability)
    const hasReplies = getRandomBoolean(0.4);
    const replies = hasReplies ? generateReplies(index + 1) : [];
    
    // Whether has follow-up (20% probability)
    const hasFollowUp = getRandomBoolean(0.2);
    const followUp = hasFollowUp ? generateFollowUp() : undefined;
    
    return {
      id: index + 1,
      title: title.substring(0, 100), // Limit title length
      body: body || 'This is a great review content.',
      reviewer_name: reviewerName,
      product_handle: comment.product_handle || comment['Product Handle'] || 'default-product',
      timestamp,
      rating,
      helpful_count: helpfulCount,
      verified_purchase: verifiedPurchase,
      featured,
      likes,
      images: images.length > 0 ? images : undefined,
      replies: replies.length > 0 ? replies : undefined,
      has_follow_up: hasFollowUp,
      follow_up: followUp
    };
  });
  
  return processedComments;
}

// Main processing function
function main() {
  try {
    console.log('Starting to process comment data...');
    
    // Read original CSV data
    const csvPath = path.join(__dirname, 'mock-comments.csv');
    const rawComments = readCSV(csvPath);
    console.log(`Read ${rawComments.length} original comment data`);
    
    // Process comment data
    const processedComments = processComments(rawComments);
    console.log(`Processing completed, generated ${processedComments.length} enhanced comment data`);
    
    // Generate statistics
    const stats = {
      total: processedComments.length,
      featured: processedComments.filter(c => c.featured).length,
      verified: processedComments.filter(c => c.verified_purchase).length,
      withImages: processedComments.filter(c => c.images && c.images.length > 0).length,
      withReplies: processedComments.filter(c => c.replies && c.replies.length > 0).length,
      withFollowUp: processedComments.filter(c => c.has_follow_up).length,
      averageRating: (processedComments.reduce((sum, c) => sum + c.rating, 0) / processedComments.length).toFixed(1),
      ratingDistribution: {
        5: processedComments.filter(c => c.rating === 5).length,
        4: processedComments.filter(c => c.rating === 4).length,
        3: processedComments.filter(c => c.rating === 3).length,
        2: processedComments.filter(c => c.rating === 2).length,
        1: processedComments.filter(c => c.rating === 1).length,
      }
    };
    
    // Save processed data
    const outputData = {
      comments: processedComments,
      statistics: stats,
      lastUpdated: new Date().toISOString()
    };
    
    const outputPath = path.join(__dirname, '../src/data/comments.json');
    
    // Ensure directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');
    console.log(`Data saved to: ${outputPath}`);
    
    // Print statistics
    console.log('\n📊 Data Statistics:');
    console.log(`Total comments: ${stats.total}`);
    console.log(`Featured comments: ${stats.featured}`);
    console.log(`Verified purchases: ${stats.verified}`);
    console.log(`Comments with images: ${stats.withImages}`);
    console.log(`Comments with replies: ${stats.withReplies}`);
    console.log(`Comments with follow-up: ${stats.withFollowUp}`);
    console.log(`Average rating: ${stats.averageRating}⭐`);
    console.log('Rating distribution:');
    console.log(`  5⭐: ${stats.ratingDistribution[5]} comments`);
    console.log(`  4⭐: ${stats.ratingDistribution[4]} comments`);
    console.log(`  3⭐: ${stats.ratingDistribution[3]} comments`);
    console.log(`  2⭐: ${stats.ratingDistribution[2]} comments`);
    console.log(`  1⭐: ${stats.ratingDistribution[1]} comments`);
    
    console.log('\n✅ Comment data processing completed!');
    
  } catch (error) {
    console.error('❌ Error occurred during processing:', error);
    process.exit(1);
  }
}

// Run script
if (require.main === module) {
  main();
}

module.exports = { processComments, readCSV }; 