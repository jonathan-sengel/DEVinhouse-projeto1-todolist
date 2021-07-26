function createItemObject(itemDescription) {
  return {
    id: generateId(15),
    description: itemDescription,
    checked: false,
  }
}

function validateIfExists(description, sourceArray) {
  return sourceArray.findIndex((item) => {
    if (item.description.toLowerCase() === description.toLowerCase()) {
      return true;
    } else return false;
  });
}

function generateId(idLength) {
  let newId = '';
  const caracteres = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  for (let i = 0; i < idLength; i++) {
    newId += caracteres.charAt(Math.ceil(Math.random() * caracteres.length));
  }
  return newId;
}

export { generateId, createItemObject, validateIfExists };
