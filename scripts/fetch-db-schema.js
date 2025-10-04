const { createClient } = require('../apps/api/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('../apps/api/node_modules/dotenv').config({ path: path.join(__dirname, '../apps/api/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fetchDatabaseSchema() {
  console.log('🔍 Fetching database schema from Supabase...\n');

  try {
    // List of tables to fetch (main application tables)
    const tables = [
      'syndics',
      'companies',
      'condos',
      'coproprietes',
      'projects',
      'quotes',
      'invoices',
      'documents',
      'messages',
      'notifications'
    ];

    const schema = {};

    // Fetch schema for each table by querying with limit 0
    for (const tableName of tables) {
      console.log(`   Fetching ${tableName}...`);

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`   ⚠️  Skipping ${tableName}: ${error.message}`);
        continue;
      }

      // Extract column names from the returned data structure
      if (data && data.length > 0) {
        const columns = Object.keys(data[0]).map(colName => ({
          name: colName,
          type: typeof data[0][colName]
        }));

        schema[tableName] = { columns };
      } else {
        // Table exists but is empty, try to get structure another way
        const { data: emptyData, error: emptyError } = await supabase
          .from(tableName)
          .select('*')
          .limit(0);

        if (!emptyError) {
          schema[tableName] = {
            columns: [],
            note: 'Table is empty - could not determine column structure'
          };
        }
      }
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'db-schema');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write schema to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const outputPath = path.join(outputDir, `schema-${timestamp}.json`);
    const latestPath = path.join(outputDir, 'schema-latest.json');

    const schemaData = {
      fetchedAt: new Date().toISOString(),
      tables: schema
    };

    fs.writeFileSync(outputPath, JSON.stringify(schemaData, null, 2));
    fs.writeFileSync(latestPath, JSON.stringify(schemaData, null, 2));

    // Print summary
    console.log('✅ Database schema fetched successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Tables found: ${Object.keys(schema).length}\n`);

    Object.entries(schema).forEach(([tableName, tableData]) => {
      console.log(`   📋 ${tableName}`);
      console.log(`      Columns: ${tableData.columns.map(c => c.name).join(', ')}`);
    });

    console.log(`\n💾 Schema saved to:`);
    console.log(`   - ${outputPath}`);
    console.log(`   - ${latestPath}`);

  } catch (error) {
    console.error('❌ Error fetching schema:', error.message);
    process.exit(1);
  }
}

fetchDatabaseSchema();
