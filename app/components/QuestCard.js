// A single project, framed as a quest / forged artifact.
export default function QuestCard({ quest, accent = "--vermillion", index }) {
  const { title, artifact, blurb, reward, link } = quest;
  const Tag = link ? "a" : "div";
  const props = link ? { href: link, target: "_blank", rel: "noreferrer" } : {};

  return (
    <Tag
      className={`quest ${link ? "quest--link" : ""}`}
      data-reveal
      style={{ "--accent": `var(${accent})` }}
      {...props}
    >
      <span className="quest__no">QUEST {String(index + 1).padStart(2, "0")}</span>
      <span className="quest__artifact">{artifact}</span>
      <h4 className="quest__title">{title}</h4>
      <p className="quest__blurb">{blurb}</p>
      <div className="quest__foot">
        <span className="quest__reward">{reward}</span>
        <span className="quest__go">{link ? "ENTER ▸" : "LOCKED ◈"}</span>
      </div>
    </Tag>
  );
}
