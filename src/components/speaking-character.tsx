/** A layered vector character: facial animation follows the speech playback state. */
export function SpeakingCharacter() {
  return (
    <svg
      className="speaking-character"
      viewBox="0 0 280 300"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="140" cy="287" rx="91" ry="9" fill="#124f4b" opacity=".12" />
      <g
        className="character-body"
        stroke="#382c35"
        strokeWidth="2.5"
        strokeLinejoin="round"
      >
        <path
          d="M53 286 60 233Q64 210 109 202H171Q216 210 220 233L227 286Z"
          fill="#84364a"
        />
        <path d="m82 235-7 51m123-51 7 51" fill="none" />
        <path d="M121 181v25l19 20 19-20v-25" fill="#bd805b" />
        <path
          d="m109 202 12-7 19 31-23-9-10 15-8-25m72-5-12-7-19 31 23-9 10 15 8-25"
          fill="#a74b60"
        />
        <path d="M140 226v60" fill="none" />
        <circle cx="147" cy="245" r="2" fill="#e9c4b8" stroke="none" />
        <circle cx="147" cy="269" r="2" fill="#e9c4b8" stroke="none" />
      </g>
      <g
        className="character-head"
        stroke="#382c35"
        strokeWidth="2.5"
        strokeLinejoin="round"
      >
        <path
          d="M81 116Q65 78 86 55Q91 29 128 31Q161 15 185 43Q212 48 202 94L195 130Z"
          fill="#242733"
        />
        <ellipse cx="82" cy="133" rx="12" ry="20" fill="#cc926c" />
        <ellipse cx="198" cy="133" rx="12" ry="20" fill="#cc926c" />
        <path
          d="M85 93Q103 62 139 66Q177 62 195 94L193 151Q191 184 140 203Q91 184 87 151Z"
          fill="#dfa77e"
        />
        <path
          d="M89 150Q99 177 116 177L140 185 165 177Q183 173 192 148L188 177Q166 203 140 205Q111 202 92 177Z"
          fill="#383039"
          stroke="none"
        />
        <path
          d="M83 108 78 83Q76 45 118 43L150 32 147 48Q181 31 197 66L201 107 181 84 174 65Q145 86 116 79L124 65Q103 81 86 85Z"
          fill="#242733"
        />
        <path
          d="M91 65q17-20 39-17m22 7q22-9 34 13"
          fill="none"
          stroke="#474553"
          strokeLinecap="round"
        />
        <path
          d="m101 108 20-3m38 0 20 3"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <g className="character-eyes">
          <path
            d="M99 123q12-13 25 0-12 11-25 0m57 0q12-13 25 0-12 11-25 0"
            fill="#fff8ec"
          />
          <ellipse cx="113" cy="123" rx="5" ry="7" fill="#39333b" />
          <ellipse cx="168" cy="123" rx="5" ry="7" fill="#39333b" />
          <circle cx="115" cy="120" r="2" fill="white" stroke="none" />
          <circle cx="170" cy="120" r="2" fill="white" stroke="none" />
        </g>
        <g fill="none" stroke="#34434b" strokeWidth="3">
          <rect x="93" y="113" width="39" height="25" rx="7" />
          <rect x="148" y="113" width="39" height="25" rx="7" />
          <path d="M132 121q8-5 16 0m-65-5 10 3m94 0 10-3" />
        </g>
        <path
          d="m139 131-4 17 9 2"
          fill="none"
          stroke="#b87b58"
          strokeLinecap="round"
        />
        <path
          d="M119 160q10-7 21-3 11-4 21 3l-8 6-13-3-13 3Z"
          fill="#383039"
          stroke="none"
        />
        <path
          className="character-smile"
          d="M126 171q14 9 28 0"
          fill="none"
          strokeLinecap="round"
        />
        <g className="character-mouth">
          <ellipse cx="140" cy="173" rx="12" ry="9" fill="#482632" />
          <path d="M130 168h20l-2 4h-16Z" fill="#fff6e7" stroke="none" />
          <ellipse
            cx="140"
            cy="178"
            rx="7"
            ry="3"
            fill="#df7d85"
            stroke="none"
          />
        </g>
      </g>
    </svg>
  );
}
