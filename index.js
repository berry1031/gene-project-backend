const GraknClient = require("grakn-client");
const express = require('express');
const app = express();

const router = express.Router();


async function getGeneID (req,res) {
    const {entrez} = req.params;
    const client = new GraknClient("localhost:48555");
	const session = await client.session("disease_network");
	const readTransaction = await session.transaction().read();

	const findQuery = `match $x isa gene, has entrez-id "${entrez}"; get; limit 10;`
	// Or query and consume the iterator immediately collecting all the results
	
	const answerIterator = await readTransaction.query(findQuery);
	var genes = await answerIterator.collectConcepts();

	await readTransaction.close();
	await session.close();
	client.close();
	console.log(genes)
	return res.json(`ID of Gene: ${genes[0].id}`);
}

router.get('/:entrez', getGeneID);

app.use('/', router);


app.listen(4000);