import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import "./App.css";

const TEA_PER_LITER = 7;
const SUGAR_PER_LITER = 70;
const STARTER_PER_LITER = 0.1;

function App() {
  const { Field, handleSubmit, setFieldValue, Subscribe } = useForm({
    defaultValues: {
      water: 1,
      starter: STARTER_PER_LITER,
    },
  });

  return (
    <>
      <h2>Kombucha ingredient calculator</h2>
      <div className="main-container">
        <div className="row">
          <div className="form-container card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
            >
              <Field
                name="water"
                validators={{
                  onChange: z.number().min(0, "Must be non-negative"),
                }}
                children={({ name, state, handleChange, handleBlur }) => (
                  <div className="form-group">
                    <label htmlFor={name}>Total Water (liters)</label>
                    <input
                      id={name}
                      name={name}
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        handleChange(value);
                        if (!isNaN(value) && value >= 0) {
                          setFieldValue(
                            "starter",
                            parseFloat((value * STARTER_PER_LITER).toFixed(2))
                          );
                        }
                      }}
                      type="number"
                      min="0"
                      step="0.1"
                    />
                    <em role="alert">
                      {state.meta.errors.map((e) => e?.message).join(", ") ||
                        ""}
                    </em>
                  </div>
                )}
              />
              <Field
                name="starter"
                validators={{
                  onChange: z.number().min(0, "Must be non-negative"),
                }}
                children={({ name, state, handleChange, handleBlur }) => (
                  <div className="form-group">
                    <label htmlFor={name}>Starter Liquid (liters)</label>
                    <input
                      id={name}
                      name={name}
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        handleChange(value);
                        if (!isNaN(value) && value > 0) {
                          setFieldValue(
                            "water",
                            parseFloat((value / STARTER_PER_LITER).toFixed(2))
                          );
                        }
                      }}
                      type="number"
                      min="0.01"
                      step="0.01"
                    />

                    <em role="alert">
                      {state.meta.errors.map((e) => e?.message).join(", ") ||
                        ""}
                    </em>
                  </div>
                )}
              />
            </form>
          </div>
          <div className="ingredients card">
            <h3>Ingredients</h3>
            <Subscribe
              selector={(state) => state.values}
              children={({ water, starter }) => (
                <>
                  <p>Water: {water.toFixed(2)} liters</p>
                  <p>Tea: {(water * TEA_PER_LITER).toFixed(2)} grams</p>
                  <p>Sugar: {(water * SUGAR_PER_LITER).toFixed(2)} grams</p>
                  <p>
                    Starter Liquid: {starter.toFixed(2)} liters (
                    {(starter * 1000).toFixed(0)} mL)
                  </p>
                </>
              )}
            />
          </div>
        </div>
        <div className="instructions card">
          <h3>Instructions</h3>
          <Subscribe
            selector={(state) => state.values}
            children={({ water, starter }) => (
              <>
                <p>Boil {water.toFixed(2)} liters of purified water.</p>
                <p>
                  Steep the tea bags or loose leaf tea in the hot water for 7-15
                  minutes.
                </p>
                <p>Add sugar and stir to dissolve.</p>
                <p>
                  Check to make sure the sweet tea is body temperature or below.
                </p>
                <p>
                  Add SCOBY and {(starter * 1000).toFixed(2)} mL of starter
                  liquid.
                </p>
                <p>
                  Cover with a cloth cover and rubber band or a custom brewer
                  cap.
                </p>
                <p>
                  Place the container in a warm (~27°C), shaded area for at
                  least 7 days.
                </p>
                <p>
                  After 7 days, taste your Kombucha and decide if it needs more
                  brewing time.
                </p>
                <p>Decant & flavor your kombucha (optional).</p>
                <p>Refrigerate to slow further fermentation.</p>
              </>
            )}
          />
        </div>
      </div>
    </>
  );
}

export default App;
