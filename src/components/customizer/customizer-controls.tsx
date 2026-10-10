'use client'

import * as Slider from '@radix-ui/react-slider'
import { useId } from 'react'
import { ColorControl } from '@/components/customizer/color-control'
import { PresetCard } from '@/components/customizer/preset-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup } from '@/components/ui/radio-group'
import {
  buildCustomTokens,
  customSettingsFrom,
  MAX_BUTTON_RADIUS,
  typographyOptions,
  type Typography,
} from '@/lib/theme/custom'
import { themePresets } from '@/lib/theme/presets'
import { useThemeStore } from '@/stores/theme-store'

const typographyDescriptions: Record<Typography, string> = {
  serif: 'Cormorant Garamond with Instrument Sans',
  modern: 'Syne with Plus Jakarta Sans',
  mono: 'IBM Plex Mono with Instrument Sans',
}

export function CustomizerControls() {
  const radiusLabelId = useId()
  const selection = useThemeStore((state) => state.selection)
  const tokens = useThemeStore((state) => state.tokens)
  const custom = useThemeStore((state) => state.custom)
  const customBase = useThemeStore((state) => state.customBase)
  const selectPreset = useThemeStore((state) => state.selectPreset)
  const startCustom = useThemeStore((state) => state.startCustom)
  const updateCustom = useThemeStore((state) => state.updateCustom)
  const reset = useThemeStore((state) => state.reset)

  const settings = custom ?? customSettingsFrom(tokens)
  const customPreview = buildCustomTokens(customBase ?? tokens, settings)
  const isCustom = selection === 'custom'

  return (
    <div className="flex flex-col gap-6">
      <div role="radiogroup" aria-label="Theme presets" className="grid grid-cols-2 gap-3">
        {themePresets.map((preset) => (
          <PresetCard
            key={preset.id}
            name={preset.name}
            tokens={preset.tokens}
            isSelected={selection === preset.id}
            onSelect={() => selectPreset(preset)}
          />
        ))}
        <PresetCard
          name="Custom"
          tokens={customPreview}
          isSelected={isCustom}
          onSelect={startCustom}
        />
      </div>

      {isCustom && (
        <div className="flex flex-col gap-5 border-t border-line pt-5">
          <ColorControl
            label="Primary"
            value={settings.primary}
            onChange={(primary) => updateCustom({ primary })}
          />
          <ColorControl
            label="Accent"
            value={settings.accent}
            onChange={(accent) => updateCustom({ accent })}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span id={radiusLabelId} className="text-xs font-medium text-ink">
                Button radius
              </span>
              <span className="text-xs text-muted tabular-nums">
                {settings.isPill ? 'Pill' : `${settings.buttonRadius} px`}
              </span>
            </div>
            <Slider.Root
              min={0}
              max={MAX_BUTTON_RADIUS}
              step={1}
              value={[settings.buttonRadius]}
              disabled={settings.isPill}
              onValueChange={([value]) => updateCustom({ buttonRadius: value ?? 0 })}
              aria-labelledby={radiusLabelId}
              className="relative flex h-tap touch-none items-center select-none data-[disabled]:opacity-40"
            >
              <Slider.Track className="relative h-px grow bg-line">
                <Slider.Range className="absolute h-full bg-ink" />
              </Slider.Track>
              <Slider.Thumb
                aria-label="Button radius"
                className="block size-5 rounded-full border border-ink bg-surface shadow-float"
              />
            </Slider.Root>
            <Checkbox
              label="Pill buttons"
              checked={settings.isPill}
              onCheckedChange={(checked) => updateCustom({ isPill: checked === true })}
            />
          </div>

          <RadioGroup
            legend="Typography"
            value={settings.typography}
            onValueChange={(value) => updateCustom({ typography: value as Typography })}
            options={(Object.keys(typographyOptions) as Typography[]).map((key) => ({
              value: key,
              label: typographyOptions[key].label,
              description: typographyDescriptions[key],
            }))}
          />
          <p className="text-xs text-muted">
            Text on buttons and badges switches between black and white to stay readable.
          </p>
        </div>
      )}

      <Button variant="secondary" isFullWidth onClick={reset}>
        Reset to default
      </Button>
    </div>
  )
}
