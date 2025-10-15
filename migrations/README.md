# Database Migrations

## Remove main_image_url column

### Problem
The `ktvs` table has a `main_image_url` column that should not exist. The `main_image_url` is a computed field that should be calculated from the `ktv_images` relationship, not stored directly in the database.

### Solution
Run the following SQL in your Supabase SQL Editor:

```sql
-- Drop the main_image_url column from ktvs table
ALTER TABLE ktvs DROP COLUMN IF EXISTS main_image_url;
```

### Verification
After running the migration, verify that the column has been removed by running:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ktvs' AND table_schema = 'public';
```

The `main_image_url` column should not appear in the results.

### Why this is needed
- `main_image_url` is a computed field calculated from `ktv_images` relationship
- Storing it directly in the database creates data inconsistency
- The computed field is more flexible and always up-to-date
