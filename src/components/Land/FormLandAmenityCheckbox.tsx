import { LandAmenityOptions } from '@/common/const';
import { LandAmenity } from '@/common/enum';
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography
} from '@mui/material';
import { Controller } from 'react-hook-form';

export default function FormLandAmenityCheckbox({
    name,
    control,
}: {
    name: string;
    control: any;
}) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
                <FormGroup>
                    <Typography sx={{ fontWeight: 'bold' }}>Tiện ích</Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 1,
                        }}
                    >
                        {Object.values(LandAmenity).map(value => (
                            <FormControlLabel
                                key={value}
                                control={
                                    <Checkbox
                                        checked={field.value?.includes(value)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                field.onChange([...(field.value || []), value]);
                                            } else {
                                                field.onChange(
                                                    field.value.filter((v: string) => v !== value),
                                                );
                                            }
                                        }}
                                    />
                                }
                                label={LandAmenityOptions[value]}
                            />
                        ))}
                    </Box>
                </FormGroup>
            )}
        />
    );
}
