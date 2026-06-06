const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres.nglhnxdkpmxqvsytwuue:gusdurianmjk@aws-1-ap-south-1.pooler.supabase.com:6543/postgres'
  });
  await client.connect();

  // Check RLS and policies on verifications
  const rls = await client.query(`
    SELECT relname, relrowsecurity 
    FROM pg_class WHERE relname = 'verifications';
  `);
  console.log('RLS enabled:', rls.rows[0]?.relrowsecurity);

  const policies = await client.query(`
    SELECT policyname, cmd, qual, with_check 
    FROM pg_policies WHERE tablename = 'verifications';
  `);
  console.log('Policies:', JSON.stringify(policies.rows, null, 2));

  // Try a test insert
  try {
    await client.query(`
      INSERT INTO verifications (email, code, purpose, expires_at) 
      VALUES ('test@test.com', '123456', 'register', NOW() + INTERVAL '10 minutes')
    `);
    console.log('INSERT OK');
    await client.query(`DELETE FROM verifications WHERE email = 'test@test.com'`);
    console.log('DELETE OK');
  } catch(e) {
    console.error('INSERT FAILED:', e.message);
  }

  await client.end();
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
