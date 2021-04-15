import {checkRules, getNextState} from "../GoLService";

describe("Rules", () => {
  describe("underpopulation",  () => {
    it("should do underpopulation", () => {
      const map = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
      const map2 = JSON.parse(JSON.stringify(map));
      const result = getNextState(map, map2);
      expect(result.map[2][2]).toBe(0);
    })

    it("should do underpopulation top left corner", () => {
      const map = [
        [1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]]
      const map2 = JSON.parse(JSON.stringify(map));
      const result = getNextState(map, map2);
      expect(result.map[0][0]).toBe(0);
    })

    it("should do underpopulation bottom left corner", () => {
      const map = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0]]
      const map2 = JSON.parse(JSON.stringify(map));
      const result = getNextState(map, map2);
      expect(result.map[4][0]).toBe(0);
    })

    it("should do underpopulation top right corner", () => {
      const map = [
        [1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]]
      const map2 = JSON.parse(JSON.stringify(map));
      const result = getNextState(map, map2);
      expect(result.map[0][4]).toBe(0);
    })

    it("should do underpopulation bottom right corner", () => {
      const map = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1]]
      const map2 = JSON.parse(JSON.stringify(map));
      const result = getNextState(map, map2);
      expect(result.map[4][4]).toBe(0);
    })
  });

  describe("stay alive",  () => {

    it("should stay alive with 2 neighbours", () => {
      const map = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0]]
      const map2 = JSON.parse(JSON.stringify(map));
      const result = getNextState(map, map2);
      expect(result.map[2][2]).toBe(1);
    })

    it("should stay alive with 3 neighbours", () => {
      const map = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0]]
      const map2 = JSON.parse(JSON.stringify(map));
      const result = getNextState(map, map2);
      expect(result.map[2][2]).toBe(1);
    })
  });

  describe("die (overpopulation",  () => {

    it("should die", () => {
      const map = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0]]
      const map2 = JSON.parse(JSON.stringify(map));
      const result = getNextState(map, map2);
      expect(result.map[2][2]).toBe(0);
    })
  });

  describe("revive",  () => {

    it("should revive", () => {
      const map = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0]]
      const map2 = JSON.parse(JSON.stringify(map));
      const result = getNextState(map, map2);
      expect(result.map[2][2]).toBe(1);
    })
  });
})
