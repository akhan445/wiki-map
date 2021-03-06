const { Pool } = require("pg");
const dbParams = require("./db.js");
const db = new Pool(dbParams);


// --------------------------  MAPS -------------------------------
const createNewMap=  function(map) {

  const { title, description , image_url, lat, long} = map;
  const sqlQuery = `
  INSERT INTO maps
  (title, description, image_url, center_latitude, center_longitude)
  VALUES
  ( $1, $2, $3, $4, $5)
  RETURNING *`;

  return db
  .query(sqlQuery, [title, description, image_url, lat, long])
  .then(result => {
    return result.rows[0];
  })
  .catch(err => {
    return null;
  });

}
exports.createNewMap = createNewMap;



const addFavouriteMap=  function(mapId) {

  const sqlQuery = `
  UPDATE maps
    SET favourite = TRUE
  WHERE id = $1`;

  return db
  .query(sqlQuery, [mapId])
    .then(result => {
      //might need result.rows
      return result;
    })
    .catch(err => {
      return null;
    });

}
exports.addFavouriteMap = addFavouriteMap;

const getFavouriteMap = function(userId) {

  //might have to double check if this query works
  const sqlQuery =`
  SELECT maps.id, maps.image_url, maps.title, users.name, users.email
  FROM maps
  JOIN users ON user_id = users.id
  WHERE user_id = $1 AND favourite = TRUE`;

  return db
    .query(sqlQuery, [userId])
    .then(result => {
      //might have to add [0]
      return result;
    })
    .catch(err => {
      return null;
    });
}
exports.getFavouriteMap = getFavouriteMap;


const getContributedMap = function(userId) {

  //might have to double check if this query works
  const sqlQuery =`
  SELECT DISTINCT maps.title, maps.image_url, maps.id
  FROM maps
  JOIN points ON maps.id = points.map_id
  WHERE points.user_id = $1 `;

  return db
    .query(sqlQuery, [userId])
    .then(result => {
      //console.log(result.rows, "RESULT.ROWS")
      //might have to add [0]
      return result.rows;
    })
    .catch(err => {
      return null;
    });
}
exports.getContributedMap = getContributedMap;


const getPointbyMapId = function(mapId) {

  //might have to double check if this query works
  const sqlQuery =`
  SELECT points.id, points.latitude, points.longitude, points.title, points.image, points.description
  FROM points
  JOIN maps ON maps.id = points.map_id
  WHERE map_id = $1 `;

  return db
    .query(sqlQuery, [mapId])
    .then(result => {
      //might have to add [0]
      return result.rows;
    })
    .catch(err => {
      return null;
    });
}
exports.getPointbyMapId = getPointbyMapId;


const getMaps = function() {

  //might have to double check if this query works
  const sqlQuery =`
  SELECT *
  FROM maps`;

  return db
    .query(sqlQuery)
    .then(result => {
      //might have to add [0]
      return result.rows;
    })
    .catch(err => {
      return null;
    });
}
exports.getMaps = getMaps;

const getMap = function(mapId) {

  //might have to double check if this query works
  const sqlQuery =`
  SELECT *
  FROM maps
  WHERE id = $1 `;

  return db
    .query(sqlQuery, [mapId])
    .then(result => {
      //might have to add [0]

      return result.rows[0];
    })
    .catch(err => {
      return null;
    });
}
exports.getMap = getMap;




// ------------------------    POINTS ------------------------------

const addPoint=  function(point) {
  //point should be an object containing the information
  const { title, description, imageURL, lat, lng, map_id, user_id  } = point;
  const sqlQuery = `
  INSERT INTO points
    (title, description, image, latitude, longitude, map_id, user_id)
  VALUES
    ( $1, $2, $3, $4, $5, $6, $7)
  RETURNING *`;

  return db
  .query(sqlQuery, [title, description, imageURL, Number(lat), Number(lng), map_id, user_id])
    .then(result => {

      return result.rows[0];
    })
    .catch(err => {
      return null;
    });

}
exports.addPoint = addPoint;

const deletePoint=  function(pointId) {
  // pointId should be the id of the pointer

  const pointVal = pointId; //not sure if this will work in query
  const sqlQuery = `
  DELETE FROM points
    WHERE id = $1`;

  return db
  .query(sqlQuery, pointVal)
    .then(result => {
      //might need result.rows[0]
      //console.log(result.rows[0])
      return result.rows;
    })
    .catch(err => {
      return null;
    });

}
exports.deletePoint = deletePoint;

const editPoint=  function(point) {
  //point should be an object containing the information

  //not changing lat and log because it is at the same spot
  const { title, description, image, id} = point;
  const sqlQuery = `
  UPDATE points
    SET title = $1,
    description = $2,
    image = $3
  WHERE id = $4`;

  return db
  .query(sqlQuery, [title, description, image, id])
    .then(result => {
      //might need result.rows
      return result;
    })
    .catch(err => {
      return null;
    });

}
exports.editPoint = editPoint;






