function triangle(
    val1: number = 3,
    type1: "leg" | "hypotenuse" | "adjacent angle" | "opposite angle" | "angle" = "leg",
    val2: number = 4,
    type2: "leg" | "hypotenuse" | "adjacent angle" | "opposite angle" | "angle" = "leg"
  ): string {
    const validTypes = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];
    const anglesTypes = ["adjacent angle", "opposite angle", "angle"];
  
    const isValidType = (type: string): boolean => validTypes.includes(type);
    const isValidValue = (val: number): boolean => val > 0;
    const isAngle = (type: string): boolean => anglesTypes.includes(type);
    const isValidAngle = (angle: number): boolean => angle < 90;
    const isLeg = (type: string): boolean => type === "leg";
    const isHypotenuse = (type: string): boolean => type === "hypotenuse";
    const isValidTriangle = (a: number, b: number, c: number): boolean => a + b > c && a + c > b && c + b > a;
    const toDegrees = (angle: number): number => angle * (180 / Math.PI);
    const toRadians = (angle: number): number => angle * (Math.PI / 180);
  
    let a: number, b: number, c: number, alpha: number, beta: number;
  
    if (!isValidType(type1) || !isValidType(type2)) {
        console.log(
          "Please read the instructions again and provide valid types in valid order."
        );
        return "failed";
      }
    
      if (!isValidValue(val1) || !isValidValue(val2)) {
        return "Invalid input: Values must be positive number and non-zero.";
      }
    
      if (type1 === "hypotenuse" && type2 === "hypotenuse") {
        console.log(
          "Invalid input: Two hypotenuses are provided. Please provide valid types in valid order."
        );
        return "failed";
      }
      if (
        (isHypotenuse(type1) && isLeg(type2) && val1 - val2 <= 0) ||
        (isHypotenuse(type2) && isLeg(type1) && val2 - val1 <= 0)
      ) {
        return "Hypotenuse must be greater than the leg";
      }
      if (isAngle(type1) && isAngle(type2)) {
        console.log(
          "Invalid input: Two angles are provided. Please provide valid types in valid order."
        );
        return "failed";
      }
      if (
        (isAngle(type1) && !isValidAngle(val1)) ||
        (isAngle(type2) && !isValidAngle(val2))
      ) {
        return "The angles of the triangle must be acute";
      }
    switch (type1) {
      case "leg":
        a = val1;
        switch (type2) {
          case "hypotenuse":
            c = val2;
            b = Math.sqrt(c * c - a * a);
            alpha = toDegrees(Math.asin(a / c));
            beta = 90 - alpha;
            break;
          case "leg":
            b = val2;
            c = Math.sqrt(a * a + b * b);
            alpha = toDegrees(Math.asin(a / c));
            beta = 90 - alpha;
            break;
          case "adjacent angle":
            beta = val2;
            alpha = 90 - beta;
            c = a / Math.cos(toRadians(beta));
            b = Math.sqrt(c * c - a * a);
            break;
          case "opposite angle":
            alpha = val2;
            beta = 90 - alpha;
            c = a / Math.sin(toRadians(alpha));
            b = Math.sqrt(c * c - a * a);
            break;
          default:
            return "Not enough information to perform calculations";
        }
        break;
      case "hypotenuse":
        c = val1;
        switch (type2) {
          case "leg":
            a = val2;
            b = Math.sqrt(c * c - a * a);
            alpha = toDegrees(Math.asin(a / c));
            beta = 90 - alpha;
            break;
          case "angle":
            alpha = val2;
            beta = 90 - alpha;
            a = c * Math.sin(toRadians(alpha));
            b = Math.sqrt(c * c - a * a);
            break;
          default:
            return "Not enough information to perform calculations";
        }
        break;
      case "adjacent angle":
        alpha = val1;
        beta = 90 - alpha;
        switch (type2) {
          case "leg":
            a = val2;
            c = a / Math.cos(toRadians(alpha));
            b = Math.sqrt(c * c - a * a);
            break;
          case "hypotenuse":
            c = val2;
            a = c * Math.sin(toRadians(alpha));
            b = Math.sqrt(c * c - a * a);
            break;
          default:
            return "Not enough information to perform calculations";
        }
        break;
      case "opposite angle":
        alpha = val1;
        beta = 90 - alpha;
        switch (type2) {
          case "leg":
            a = val2;
            c = a / Math.sin(toRadians(alpha));
            b = Math.sqrt(c * c - a * a);
            break;
          case "hypotenuse":
            c = val2;
            a = c * Math.cos(toRadians(alpha));
            b = Math.sqrt(c * c - a * a);
            break;
          default:
            return "Not enough information to perform calculations";
        }
        break;
      case "angle":
        alpha = val1;
        beta = 90 - alpha;
        c = val2;
        a = c * Math.sin(toRadians(alpha));
        b = Math.sqrt(c * c - a * a);
        break;
    }
  
    if (!isValidTriangle(a, b, c)) {
      return "Invalid triangle: the sum of any two sides must be greater than the third side.";
    }
  
    if (!isValidAngle(alpha) || !isValidAngle(beta)) {
      return "The angles of the triangle must be acute";
    }
  
    console.log({ a, b, c, alpha, beta });
    return "success";
  }
  

  function testTriangle() {
    console.log("Running tests...");
  
    function logTestCase(description: string, val1: number, type1: any, val2: number, type2: any, expected: string) {
      const result = triangle(val1, type1, val2, type2);
      console.log(`${description} -> Expected: ${expected}, Got: ${result}`);
      console.assert(result === expected, `${description} Failed`);
    }
  
    // Valid cases
    logTestCase("Valid right triangle (legs)", 3, "leg", 4, "leg", "success");
    logTestCase("Valid right triangle (hypotenuse and leg)", 5, "hypotenuse", 3, "leg", "success");
    logTestCase("Valid right triangle (angle and hypotenuse)", 30, "angle", 10, "hypotenuse", "success");
  
    // Invalid types
    logTestCase("Invalid type1", 3, "invalid" as any, 4, "leg", "failed");
    logTestCase("Invalid type2", 3, "leg", 4, "invalid" as any, "failed");
  
    // Invalid values
    logTestCase("Negative leg", -3, "leg", 4, "leg", "Invalid input: Values must be positive numbers.");
    logTestCase("Negative leg (second)", 3, "leg", -4, "leg", "Invalid input: Values must be positive numbers.");
    logTestCase("Zero leg", 0, "leg", 4, "leg", "Invalid input: Values must be positive numbers.");
    console.log("__________________________________")
    console.log(triangle( 0, "leg", 4, "leg"));
    // Two hypotenuses
    logTestCase("Two hypotenuses", 5, "hypotenuse", 6, "hypotenuse", "failed");
  
    // Hypotenuse must be greater than the leg
    logTestCase("Hypotenuse smaller than leg", 5, "leg", 3, "hypotenuse", "Hypotenuse must be greater than the leg");
  
    // Two angles
    logTestCase("Two angles", 30, "angle", 60, "angle", "failed");
  
    // Invalid angles
    logTestCase("Angle greater than 90", 100, "angle", 10, "leg", "The angles of the triangle must be acute");
  
    // Invalid triangle condition
    logTestCase("Invalid triangle condition", 10, "leg", 50, "leg", "Invalid triangle: the sum of any two sides must be greater than the third side.");
    console.log("__________________________________");
    console.log(triangle( 10, "leg", 50, "leg"));
    console.log("All tests completed.");
  }
  
  testTriangle();
  