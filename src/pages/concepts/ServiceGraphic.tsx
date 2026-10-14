/** Original schematic illustrations, not product captures or live interfaces. */
export function ServiceGraphic({ kind }: { kind: string }) {
  return <svg className={`service-graphic service-graphic-${kind}`} viewBox="0 0 240 128" fill="none" aria-hidden="true">
    {kind === '01' ? <>
      <path className="graphic-surface" d="M28 13H212V115H28Z"/>
      <path className="graphic-line" d="M28 33H212M42 23H65M174 23H197M42 47H109M42 56H94M42 68H119M42 91H89"/>
      <path className="graphic-accent" d="M145 46H197V99H145Z"/><path className="graphic-cyan" d="M157 85L170 61L185 85M163 75H179"/>
      <path className="graphic-accent" d="M42 79H103V99H42Z"/>
    </> : kind === '02' ? <>
      <path className="graphic-cyan" d="M85 36H117L137 64H158M85 94H117L137 64"/>
      <path className="graphic-surface" d="M20 18H85V54H20ZM20 76H85V112H20ZM158 43H224V85H158Z"/>
      <path className="graphic-line" d="M32 30H70M32 40H55M32 88H70M32 98H55M173 58H209M173 70H196"/>
      <circle className="graphic-accent" cx="137" cy="64" r="4"/>
    </> : <>
      <path className="graphic-surface" d="M24 16H126V108H24Z"/>
      <path className="graphic-line" d="M39 33H94M39 45H111M39 57H99M39 69H84"/>
      <path className="graphic-cyan" d="M126 62H154"/>
      <path className="graphic-accent" d="M154 37H222V89H154Z"/>
      <circle className="graphic-line" cx="188" cy="53" r="6"/><path className="graphic-line" d="M176 75V70C176 60 200 60 200 70V75"/>
      <path className="graphic-accent" d="M39 86H88"/>
    </>}
  </svg>;
}
