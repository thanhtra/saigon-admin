import { RentalAmenityOptions } from '@/common/const';
import { RentalAmenity } from '@/common/enum';
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup
} from '@mui/material';
import { Controller } from 'react-hook-form';

export default function FormAmenityCheckbox({
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
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 1,
                        }}
                    >
                        {Object.values(RentalAmenity).map(value => (
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
                                label={RentalAmenityOptions[value]}
                            />
                        ))}
                    </Box>
                </FormGroup>
            )}
        />
    );
}
