import { base } from "@/infra/rpc/base";
import { findByNameCharacterRoute } from "./byName";
import { cancelDeleteCharacterRoute } from "./cancelDelete";
import { createCharacterRoute } from "./create";
import { deleteCharacterRoute } from "./delete";
import { editByNameCharacterRoute } from "./editByName";
import { charactersRoute } from "./list";

export const accountCharactersRoutes = base.router({
	list: charactersRoute,
	create: createCharacterRoute,
	findByName: findByNameCharacterRoute,
	editByName: editByNameCharacterRoute,
	deleteByName: deleteCharacterRoute,
	cancelDeleteByName: cancelDeleteCharacterRoute,
});
