// Run this using mongosh (renames collections by replacing space with +).
// $ mongosh rename_collections.js
use('webgme');

// Print the current database
print(`Using database: ${db.getName()}`);

// Get the list of all collections in the database
const collections = db.getCollectionNames();

// Print the list of collections
print(`Collections found: ${JSON.stringify(collections)}`);

// Iterate through each collection
collections.forEach(function(collectionName) {
    // Replace spaces with plus signs
    const newCollectionName = collectionName.replace(/ /g, '+');
    
    // Print current and new collection names
    print(`Processing collection: ${collectionName}`);
    print(`New collection name: ${newCollectionName}`);
    
    // Check if the collection name needs to be changed
    if (collectionName !== newCollectionName) {
        // Check if the new collection name already exists
        const collectionExists = db.getCollectionNames().includes(newCollectionName);

        if (collectionExists) {
            print(`Collection with name ${newCollectionName} already exists. Skipping rename.`);
        } else {
            try {
                // Rename the collection
                db[collectionName].renameCollection(newCollectionName);
                print(`Renamed collection ${collectionName} to ${newCollectionName}`);
                
                // Verify that the rename was successful
                if (db.getCollectionNames().includes(newCollectionName)) {
                    // Drop the old collection
                    db[collectionName].drop();
                    print(`Dropped old collection ${collectionName}`);
                }
            } catch (e) {
                print(`Error renaming collection ${collectionName}: ${e}`);
            }
        }
    }
});

