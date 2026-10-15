import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Slider from './Slider'
import Checkbox from './Checkbox'
import EditableText from './EditableText'
import MoneyInput from './MoneyInput'
import IconButton from './IconButton'
import RunwayChart from './RunwayChart'

describe('MoneyInput', () => {
  it('sends 0 when cleared', () => {
    const onChange = vi.fn()
    render(<MoneyInput label="Rent" value={100} currency="JPY" onChange={onChange} />)
    userEvent.clear(screen.getByLabelText('Rent'))
    expect(onChange).toHaveBeenLastCalledWith(0)
  })
  it('sends 0 for negative numbers', () => {
    const onChange = vi.fn()
    render(<MoneyInput label="Rent" value={0} currency="JPY" onChange={onChange} />)
    userEvent.type(screen.getByLabelText('Rent'), '-50')
    expect(onChange).toHaveBeenLastCalledWith(0)
  })
  it('sends the typed number', () => {
    const onChange = vi.fn()
    render(<MoneyInput label="Rent" value={0} currency="JPY" onChange={onChange} />)
    userEvent.type(screen.getByLabelText('Rent'), '1200')
    expect(onChange).toHaveBeenLastCalledWith(1200)
  })
  it('shows the saved amount with thousands separators', () => {
    render(<MoneyInput label="Rent" value={2200000} currency="JPY" onChange={() => {}} />)
    expect(screen.getByLabelText('Rent')).toHaveValue('2,200,000')
  })
  it('shows the currency symbol', () => {
    render(<MoneyInput label="Rent" value={0} currency="JPY" onChange={() => {}} />)
    expect(screen.getByText('¥')).toBeInTheDocument()
  })
})

describe('EditableText', () => {
  it('saves the new name on Enter', () => {
    const onChange = vi.fn()
    render(<EditableText label="Name" value="Rent" onChange={onChange} />)
    const input = screen.getByLabelText('Name')
    userEvent.type(input, '2{enter}')
    expect(onChange).toHaveBeenCalledWith('Rent2')
  })
  it('reverts an empty name on blur', () => {
    const onChange = vi.fn()
    render(<EditableText label="Name" value="Rent" onChange={onChange} />)
    const input = screen.getByLabelText('Name')
    userEvent.clear(input)
    fireEvent.blur(input)
    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveValue('Rent')
  })
})

describe('Slider', () => {
  it('sends the new value', () => {
    const onChange = vi.fn()
    render(<Slider label="Salary" value={0} min={0} max={1000} step={10} onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('Salary'), { target: { value: '500' } })
    expect(onChange).toHaveBeenCalledWith(500)
  })
  it('sits at max when the value is above max', () => {
    render(<Slider label="Salary" value={5000} min={0} max={1000} step={10} onChange={() => {}} />)
    expect(screen.getByLabelText('Salary')).toHaveValue('1000')
  })
})

describe('Checkbox', () => {
  it('sends the unchecked state', () => {
    const onChange = vi.fn()
    render(<Checkbox label="Include Rent" checked onChange={onChange} />)
    userEvent.click(screen.getByLabelText('Include Rent'))
    expect(onChange).toHaveBeenCalledWith(false)
  })
})

describe('IconButton', () => {
  it('does nothing when disabled', () => {
    const onClick = vi.fn()
    render(<IconButton icon="×" label="Delete" onClick={onClick} disabled />)
    userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('RunwayChart', () => {
  it('describes the fall to zero', () => {
    const { container } = render(<RunwayChart savings={3000} netBurn={1000} currency="USD" />)
    expect(screen.getByRole('img', { name: 'Savings fall from $3,000.00 to zero over 3.0 months' })).toBeInTheDocument()
    expect(container.querySelector('path')).not.toBeNull()
  })
  it('says savings never run out when there is no burn', () => {
    render(<RunwayChart savings={3000} netBurn={0} currency="USD" />)
    expect(screen.getByRole('img', { name: 'Savings never run out' })).toBeInTheDocument()
  })
})
