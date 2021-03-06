import * as R from "ramda";
import {
  Distance,
  SelectOneCity,
  VilleLaPlusProche,
  Delete,
  DeleteInit,
  ListBestOption,
  SelectBestOption_child,
  AddNewCityInArbreCouvrant,
  arbreCouvrantTransformInPath,
} from "./fonctions.js";
import * as C from "./cities.js";

const nombreDeVille = R.length(SelectOneCity(C.citiesList)("paris"));

const city = {
  city_1: "",
  city_2: "",
};

//------------------- Definition des fonctions -------------------
const xLens = R.lensProp("city_1");
const yLens = R.lensProp("city_2");

const SearchCity1 = (city) => R.path(["city_1"], city);
const SearchCity2 = (city) => R.path(["city_2"], city);
const NearestCity = VilleLaPlusProche(C.citiesList);

//------------------- Initialisation chemin -------------------

const SetParameter = (city) =>
  R.pipe(
    R.set(xLens, "marseille"),
    R.converge(R.set(yLens), [R.pipe(SearchCity1, NearestCity), R.identity])
  )(city);

const initArbre = R.pipe(SearchCity1, AddNewCityInArbreCouvrant([]));

const initCity = (city) =>
  R.pipe(R.converge(Delete(C.citiesList), [SearchCity1, SearchCity2]))(city);

const StartInit = (city) => (citiesList) =>
  R.pipe(R.converge(DeleteInit(citiesList), [SearchCity1, R.identity]))(city);

const NewCitiesList = initCity(SetParameter(city));
const NewCitiesList2 = StartInit(SetParameter(city))(NewCitiesList);

const NewArbreCouvrant = initArbre(SetParameter(city));

const NewCity = SetParameter(city);

// ------------------- Boucle -------------------

const ArbreConstruction = (city, NewArbreCouvrant) =>
  R.pipe(SearchCity1(city), AddNewCityInArbreCouvrant(NewArbreCouvrant));

const SetCity2 = (NewArbreCouvrant, NewCitiesList) =>
  R.pipe(
    R.pluck("city", NewArbreCouvrant),
    ListBestOption(NewCitiesList, R.__),
    SelectBestOption_child
  );

const Update = (city) => (NewArbreCouvrant, NewCitiesList) =>
  R.pipe(
    R.converge(R.set(xLens), [SearchCity2, R.identity]),
    R.applySpec({
      arbre: ArbreConstruction(R.__, NewArbreCouvrant),
      city: R.converge(R.set(yLens), [
        R.pipe(
          ArbreConstruction(R.__, NewArbreCouvrant),
          SetCity2(R.__, NewCitiesList)
        ),
        R.identity,
      ]),
      newCitiesList: R.pipe(
        R.converge(R.set(yLens), [
          R.pipe(
            ArbreConstruction(R.__, NewArbreCouvrant),
            SetCity2(R.__, NewCitiesList)
          ),
          R.identity,
        ]),
        R.converge(Delete(NewCitiesList), [SearchCity1, SearchCity2])
      ),
    })
  )(city);

const GetArbre = R.path(["arbre"]);
const GetCity = R.path(["city"]);
const GetCitiesList = R.path(["newCitiesList"]);

const Boucle = (NewArbreCouvrant, NewCitiesList, city) => {
  if (R.gt(R.length(NewArbreCouvrant), nombreDeVille) == false) {
    return Boucle(
      GetArbre(Update(city)(NewArbreCouvrant, NewCitiesList)),
      GetCitiesList(Update(city)(NewArbreCouvrant, NewCitiesList)),
      GetCity(Update(city)(NewArbreCouvrant, NewCitiesList))
    );
  }

  return NewArbreCouvrant;
};

// ------------------- Distance -------------------

const pathCities = arbreCouvrantTransformInPath(
  Boucle(NewArbreCouvrant, NewCitiesList2, NewCity)
);

const distance = R.pipe(R.aperture(2), R.map(Distance(C.citiesList)), R.sum);

const kilometer = R.converge(R.add, [
  R.pipe(
    R.converge(R.remove(1), [
      R.pipe(R.length, R.subtract(R.__, 2)),
      R.identity,
    ]),
    Distance(C.citiesList)
  ),
  distance,
]);

console.log(pathCities);
console.log(kilometer(pathCities));

export { kilometer, pathCities };
