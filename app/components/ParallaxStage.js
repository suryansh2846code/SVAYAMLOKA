// A realm's 2.5D backdrop: three parallax layers (sky / mid / fore).
// Each layer is either the generated art (if provided) or a tinted
// placeholder so the whole world works before any asset exists.
//
// Movement is driven by GSAP via [data-depth] (see useParallax()).
export default function ParallaxStage({ layers = {}, accent = "--indigo", children }) {
  const { sky, mid, fore } = layers;

  return (
    <div className="stage" data-parallax-stage style={{ "--realm": `var(${accent})` }}>
      {/* SKY — slowest */}
      <div className="stage__layer stage__sky" data-depth="0.08">
        {sky ? (
          <img src={sky} alt="" />
        ) : (
          <div className="stage__ph stage__ph--sky" />
        )}
      </div>

      {/* MID — temples / structures */}
      <div className="stage__layer stage__mid" data-depth="0.22">
        {mid ? (
          <img src={mid} alt="" />
        ) : (
          <div className="stage__ph stage__ph--mid">
            <span className="stage__phlabel">mid layer → /public</span>
          </div>
        )}
      </div>

      {/* FORE — fastest */}
      <div className="stage__layer stage__fore" data-depth="0.4">
        {fore ? (
          <img src={fore} alt="" />
        ) : (
          <div className="stage__ph stage__ph--fore" />
        )}
      </div>

      {/* scene content rides above the parallax */}
      <div className="stage__content">{children}</div>
    </div>
  );
}
