import { max } from "../src/Intro";
import Intro from "../src/Intro";

describe(Intro, () => {
    it('should return the first argument if it is greater', () => {
        // AAA
        // Arrange
        const a = 2;
        const b = 1;
        // Act
        const result = max(a,b);
        // Assert
        expect(result).toBe(2);
    });
});