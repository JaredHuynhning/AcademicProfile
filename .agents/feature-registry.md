# Feature Registry — AcademicProfile

## Report Components

### QuickWinsChecklist
- **Description**: Interactive checklist for actionable quick wins with localStorage persistence
- **Trigger**: Rendered within report page when quickWins data is present
- **Backend**: localStorage read/write for completion state
- **Frontend**: Animated checklist with progress bar and completion celebration
- **Error case**: Empty wins array renders nothing; localStorage parse errors silently caught
- **E2E**: Load report with quickWins data → check items → refresh → verify persistence

### ReportFieldRenderers
- **Description**: Generic field renderers for displaying structured report data (SectionContent, BulletList, ObjectCard, etc.)
- **Trigger**: Used by MegaSectionBody to render arbitrary report field shapes
- **Backend**: Pure rendering — no state or API calls
- **Frontend**: Pattern-matches data shapes (dimensions, arrays, objects) to appropriate UI components
- **Error case**: Unknown data shape falls back to JSON stringification
- **E2E**: Generate report → verify each section renders without errors → check all field types display correctly

### render-helpers
- **Description**: Utility functions for report field formatting (clean, formatLabel, getDimensionInterpretation)
- **Trigger**: Imported by ReportFieldRenderers and report page
- **Backend**: Pure functions — no side effects
- **Frontend**: Text formatting, label classification, dimension score interpretation
- **Error case**: Unknown dimension key returns generic interpretation
- **E2E**: Call getDimensionInterpretation with each HEXACO dimension → verify personalized text returned
